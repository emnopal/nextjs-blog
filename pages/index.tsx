import Link from 'next/link'

import { userService } from '@/services/users'
import { stringHelper } from '@/lib/helper/stringHelper'
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'

export default function Home() {
	const [nameStr, setNameStr] = useState<string | null>(null)
	const [isAuthorized, setAuthorized] = useState(false)

	useEffect(() => {
		const isToken = getCookie('custom-feature-token') ?? ''
		if (userService.userValue && isToken) {
			setAuthorized(true)
		}
		if (isAuthorized) {
			const origNameStr = userService.userValue?.name
			const nameStrTitle = stringHelper.toTitleCase(origNameStr)
			setNameStr(nameStrTitle)
		}
	}, [isAuthorized])

	let homeTemplate = (
		<div className="p-4">
			<div className="container">
				<h1>Please login to continue</h1>
				<Link href="/login">Login Here</Link>
			</div>
		</div>
	)

	console.log(isAuthorized)
	if (isAuthorized) {
		console.log('authorized')
		homeTemplate = (
			<div className="p-4">
				<div className="container">
					<h1>Hi {nameStr}!</h1>
					<p>You&lsquo;re logged in with Next.js & JWT!!</p>
					<p>
						<Link href="/users">Manage Users</Link>
					</p>
				</div>
			</div>
		)
	}

	return <>{homeTemplate}</>
}
