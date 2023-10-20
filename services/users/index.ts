import { BehaviorSubject } from 'rxjs'
import getConfig from 'next/config'
import Router from 'next/router'
import { fetchWrapper } from '@/lib/api/fetch'
import { alertHelper } from '@/lib/helper/alert'
import { ICurrentAuthUserModel } from '@/repository/users'
import { setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'

const { publicRuntimeConfig } = getConfig()
const baseUrl = `${publicRuntimeConfig.apiUrl.v1}`

const userSubject = new BehaviorSubject(
	typeof window !== 'undefined' &&
		JSON.parse(localStorage.getItem('user') as string),
)

async function login(username: string, password: string) {
	const user = await fetchWrapper.POST(`${baseUrl}/auth/login`, {
		username,
		password,
	})
	const { role, token, ...saveUser } = user

	const decodedToken = jwt.decode(token) as jwt.JwtPayload

	const cookieOptions = {
		maxAge: decodedToken.exp,
	}

	setCookie('jwtToken', token, cookieOptions)

	userSubject.next(saveUser)
	localStorage.setItem('user', JSON.stringify(saveUser))
}

function logout() {
	alertHelper.clear()

	const cookieOptions = {
		maxAge: 0,
	}

	setCookie('jwtToken', null, cookieOptions)

	localStorage.removeItem('user')
	userSubject.next(null)

	Router.push('/')
}

async function register(user: any) {
	await fetchWrapper.POST(`${baseUrl}/auth/register`, user)
}

async function getAll() {
	return await fetchWrapper.GET(`${baseUrl}/users`, null)
}

async function getById(id: string) {
	return await fetchWrapper.GET(`${baseUrl}/users/${id}`, null)
}

async function update(id: string, params: any) {
	await fetchWrapper.PUT(`${baseUrl}/users/${id}`, params)

	if (id === userSubject.value.id) {
		const user = { ...userSubject.value, ...params }
		localStorage.setItem('user', JSON.stringify(user))

		userSubject.next(user)
	}
}

async function _delete(id: string) {
	await fetchWrapper.DELETE(`${baseUrl}/users/${id}`, null)

	if (id === userSubject.value.id) {
		logout()
	}
}

export const userService = {
	user: userSubject.asObservable(),
	get userValue(): ICurrentAuthUserModel {
		return userSubject.value
	},
	login,
	logout,
	register,
	getAll,
	getById,
	update,
	delete: _delete,
}
