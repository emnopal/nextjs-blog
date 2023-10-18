import getConfig from 'next/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { mongodb as db } from '@/lib/config/mongo'

const { serverRuntimeConfig } = getConfig()
const User = db.User

interface IAuth {
	username: string
	password: string
}

interface IAuthResponse {
	id: string
	username: string
	email: string
	name: string
	createdAt: Date
	updatedAt: Date
	token: string
}

async function authenticate({
	username,
	password,
}: IAuth): Promise<IAuthResponse> {
	const user = await User.findOne({ username })

	if (!(user && bcrypt.compareSync(password, user.password))) {
		throw 'Username or password is incorrect'
	}

	const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, {
		expiresIn: '7d',
	})

	const { id, email, name, createdAt, updatedAt } = user.toJSON()

	return {
		id,
		username,
		email,
		name,
		createdAt,
		updatedAt,
		token,
	}
}

async function getAll(): Promise<any> {
	return await User.find()
}

async function getById(id: string): Promise<any> {
	return await User.findById(id)
}

async function create(params: any): Promise<void> {
	if (await User.findOne({ username: params.username })) {
		throw 'Username "' + params.username + '" is already taken'
	}

	const user = new User(params)

	if (params.password) {
		user.password = bcrypt.hashSync(params.password, 10)
	}

	await user.save()
}

async function update(id: string, params: any): Promise<void> {
	const user = await User.findById(id)

	if (!user) throw 'User not found'
	if (
		user.username !== params.username &&
		(await User.findOne({ username: params.username }))
	) {
		throw 'Username "' + params.username + '" is already taken'
	}

	Object.assign(user, params)

	await user.save()
}

async function _delete(id: string): Promise<void> {
	await User.findByIdAndRemove(id)
}

export const usersRepository = {
	authenticate,
	getAll,
	getById,
	create,
	update,
	delete: _delete,
}
