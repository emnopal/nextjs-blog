import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

import { userService } from '@/services/users'

export { Layout }

interface ILayout {
	children: ReactNode
}

function Layout({ children }: ILayout): JSX.Element {
	const router = useRouter()

	useEffect(() => {
		if (userService.userValue) {
			router.push('/')
		}
	}, [router])

	return <div className="col-md-6 offset-md-3 mt-5">{children}</div>
}
