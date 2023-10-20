import { useState, useEffect } from 'react'
import { NavLink } from '@/components/NavLink'
import { userService } from '@/services/users'
import { stringHelper } from '@/lib/helper/stringHelper'

export function Nav(): JSX.Element | null {
	const [user, setUser] = useState(null)

	useEffect(() => {
		const subscription = userService.user.subscribe((x) => setUser(x))
		return () => subscription.unsubscribe()
	}, [])

	if (!user) return null

	const usernameStr = userService.userValue?.username
	const origNameStr = userService.userValue?.name
	const nameStr = stringHelper.toTitleCase(origNameStr)

	return (
		<nav className="navbar navbar-expand navbar-dark bg-dark px-3">
			<div className="container-fluid">
				<NavLink className="navbar-brand" href="/">
					Next Blog
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink href="/users" className="nav-item nav-link">
								Users
							</NavLink>
						</li>
					</ul>
					<ul className="navbar-nav">
						<li className="nav-item">
							<NavLink
								className="nav-item nav-link"
								href="/users/profile"
							>{`${nameStr} (${usernameStr})`}</NavLink>
						</li>
						<li className="nav-item">
							<button
								onClick={userService.logout}
								className="btn btn-link nav-item nav-link justify-content-end text-right"
							>
								Logout
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}
