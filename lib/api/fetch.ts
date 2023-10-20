import getConfig from 'next/config'
import { userService } from '@/services/users'
import { getCookie } from 'cookies-next'

const { publicRuntimeConfig } = getConfig()

const versioningApiUrl = publicRuntimeConfig.apiUrl.v1

interface ISetCustomHeader {
	key: string
	value: string
}

function request(method: string) {
	return async (
		url: string,
		body: any,
		addedHeader: ISetCustomHeader[] | null = null,
	) => {
		const headers = new Headers((authHeader(url) as HeadersInit) || {})
		let requestOptions: RequestInit = { method, headers }

		if (addedHeader) {
			addedHeader.map((header: ISetCustomHeader) => {
				headers.set(header.key, header.value)
			})
		}

		if (body) {
			headers.set('Content-Type', 'application/json')
			requestOptions.body = JSON.stringify(body)
		}

		return fetch(url, requestOptions).then(handleResponse)
	}
}

function authHeader(url: string) {
	const isLoggedIn = getCookie('jwtToken') ?? false
	const isApiUrl = url.startsWith(versioningApiUrl)
	if (isLoggedIn && isApiUrl) {
		return { Authorization: `Bearer ${isLoggedIn}` }
	} else {
		return {}
	}
}

async function handleResponse(response: Response) {
	const isJson = response.headers
		?.get('content-type')
		?.includes('application/json')
	const data = isJson ? await response.json() : null
	if (!response.ok) {
		if ([401, 403].includes(response.status) && userService.userValue) {
			userService.logout()
		}
		const error = (data && data.message) || response.statusText
		return Promise.reject(error)
	}
	return data
}

export const fetchWrapper = {
	GET: request('GET'),
	POST: request('POST'),
	PUT: request('PUT'),
	PATCH: request('PATCH'),
	DELETE: request('DELETE'),
	CustomRequest: request,
}
