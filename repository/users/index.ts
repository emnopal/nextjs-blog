import getConfig from 'next/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ObjectId, type Db } from 'mongodb'
import normalizeEmail from 'validator/lib/normalizeEmail'

const { serverRuntimeConfig } = getConfig()

export interface IUserModel {
	_id: ObjectId
	username: string
	name: string
	email: string
	password: string
	role: string
	isDeleting?: boolean
}

// still string since Auth User parameters are from local storage
export interface ICurrentAuthUserModel {
	_id: string
	username: string
	name: string
	email: string
	role: string
	token: string
}

export interface IAuthResponse {
	user?: IUserModel
	token?: string
}

async function authenticate(
	db: Db,
	username: string,
	plainPassword: string,
): Promise<IAuthResponse | null> {
	const usersCollection = db.collection<IUserModel>('users')
	const user = await usersCollection.findOne({ username })
	const { password, ...safeUser } = user as IUserModel

	if (user && (await bcrypt.compare(plainPassword, password))) {
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				name: user.name,
				role: user.role,
			},
			serverRuntimeConfig.secret,
			{
				expiresIn: '5 days',
			},
		)
		return { ...safeUser, token } // filtered out password
	}

	throw 'Wrong Credentials'
}

async function getAll(db: Db): Promise<IUserModel[]> {
	const usersCollection = db.collection<IUserModel>('users')
	return await usersCollection
		.find({}, { projection: { password: 0 } })
		.toArray()
}

async function getById(db: Db, id: string): Promise<IUserModel | null> {
	const usersCollection = db.collection<IUserModel>('users')
	return await usersCollection
		.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })
		.then((user) => user || null)
}

async function getByUsername(
	db: Db,
	username: string,
): Promise<IUserModel | null> {
	const usersCollection = db.collection<IUserModel>('users')
	return await usersCollection
		.findOne({ username: username }, { projection: { password: 0 } })
		.then((user) => user || null)
}

async function getByEmail(db: Db, email: string): Promise<IUserModel | null> {
	email = normalizeEmail(email) as string
	const usersCollection = db.collection<IUserModel>('users')
	return await usersCollection
		.findOne({ email: email }, { projection: { password: 0 } })
		.then((user) => user || null)
}

async function create(db: Db, params: IUserModel): Promise<IUserModel> {
	const usersCollection = db.collection<IUserModel>('users')

	if (await usersCollection.findOne({ username: params.username })) {
		throw 'Username "' + params.username + '" is already taken'
	}

	if (params.password) {
		params.password = await bcrypt.hash(params.password, 10)
	}

	params.role = 'user'

	const { insertedId } = await usersCollection.insertOne(params)
	params._id = insertedId
	return params
}

async function update(
	db: Db,
	id: string,
	params: Partial<IUserModel>,
): Promise<void> {
	const usersCollection = db.collection<IUserModel>('users')
	const existingUser = await usersCollection.findOne({ _id: new ObjectId(id) })

	if (!existingUser) {
		throw 'User not found'
	}

	if (existingUser.username !== params.username) {
		const userWithSameUsername = await usersCollection.findOne({
			username: params.username,
		})

		if (userWithSameUsername) {
			throw 'Username "' + params.username + '" is already taken'
		}
	}

	return await usersCollection
		.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: params },
			{ returnDocument: 'after', projection: { password: 0 } },
		)
		.then(({ value }: any) => value)
}

async function updatePassword(
	db: Db,
	id: string,
	oldPassword: string,
	newPassword: string,
) {
	const usersCollection = db.collection<IUserModel>('users')
	const user = await usersCollection.findOne(new ObjectId(id))
	if (!user) return false
	const matched = await bcrypt.compare(oldPassword, user.password)
	if (!matched) return false
	const password = await bcrypt.hash(newPassword, 10)
	await usersCollection.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { password } },
	)
	return true
}

async function _delete(db: Db, id: string): Promise<void> {
	const usersCollection = db.collection<IUserModel>('users')
	await usersCollection.deleteOne({ _id: new ObjectId(id) })
}

export const usersRepository = {
	authenticate,
	getAll,
	getById,
	getByEmail,
	getByUsername,
	create,
	update,
	updatePassword,
	delete: _delete,
}
