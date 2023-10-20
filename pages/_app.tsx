import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import '@/styles/globals.css'
import { userService } from '@/services/users'
import { Nav } from '@/components/Nav'
import { Alert } from '@/components/Alert'
import { Footer } from '@/components/Footer'
import { ICurrentAuthUserModel } from '@/repository/users'
import { getCookie } from 'cookies-next'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const { asPath, events } = router
	const [user, setUser] = useState<ICurrentAuthUserModel | null>(null)
	const [authorized, setAuthorized] = useState(false)

	useEffect(() => {
		function authCheck(url: string) {

			setUser(userService.userValue)
			const isToken = getCookie('jwtToken') ?? ''

			const publicPaths = ['/login', '/register', '/']
			const path = url.split('?')[0]

			if (
				!userService.userValue && !publicPaths.includes(path) && !isToken
			) {
				setAuthorized(false)
				router.push({
					pathname: '/login',
					query: { returnUrl: asPath },
				})
			} else {
				setAuthorized(true)
			}
		}

		authCheck(asPath)

		const hideContent = () => setAuthorized(false)
		events.on('routeChangeStart', hideContent)

		events.on('routeChangeComplete', authCheck)

		return () => {
			events.off('routeChangeStart', hideContent)
			events.off('routeChangeComplete', authCheck)
		}
	}, [router, asPath, events])

	return (
		<>
			<Head>
				<title>User Auth</title>
			</Head>

			<div className={`app-container ${user ? 'bg-light' : ''}`}>
				<Nav />
				<Alert />
				{authorized && <Component {...pageProps} />}
				<Footer />
			</div>
		</>
	)
}
