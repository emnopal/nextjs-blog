import Link from 'next/link'
import { useState, useEffect } from 'react'

import { Layout } from '@/components/users/Layout'
import { Spinner } from '@/components/Spinner'
import { userService } from '@/services/users'
import { IUserModel } from '@/repository/users'

export default function Index() {
	const [users, setUsers] = useState<IUserModel[] | null | undefined>(null)

	useEffect(() => {
		userService.getAll().then((x) => setUsers(x))
	}, [])

	function deleteUser(id: string) {
		setUsers(
			users?.map((x: IUserModel) => {
				if (x._id.toString() === id) {
					x.isDeleting = true
				}
				return x
			}),
		)
		userService.delete(id).then(() => {
			setUsers(users?.filter((x: IUserModel) => x._id.toString() !== id))
		})
	}
	return (
		<Layout>
			<h1>Users</h1>
			<Link href="/users/add" className="btn btn-sm btn-success mb-2">
				Add User
			</Link>
			<table className="table table-striped">
				<thead>
					<tr>
						<th style={{ width: '30%' }}>Name</th>
						<th style={{ width: '30%' }}>Username</th>
						<th style={{ width: '30%' }}>Email</th>
						<th style={{ width: '10%' }}></th>
					</tr>
				</thead>
				<tbody>
					{users &&
						users.map((user: any) => (
							<tr key={user._id}>
								<td>
									<Link href={`/users/${user._id}`}>{user.name}</Link>
								</td>
								<td>{user.username}</td>
								<td>{user.email}</td>
								<td style={{ whiteSpace: 'nowrap' }}>
									<Link
										href={`/users/${user._id}?enable_edit=true`}
										className="btn btn-sm btn-primary me-1"
									>
										Edit
									</Link>
									<button
										onClick={() => deleteUser(user._id)}
										className="btn btn-sm btn-danger btn-delete-user"
										style={{ width: '60px' }}
										disabled={user.isDeleting}
									>
										{user.isDeleting ? (
											<span className="spinner-border spinner-border-sm"></span>
										) : (
											<span>Delete</span>
										)}
									</button>
								</td>
							</tr>
						))}
					{!users && (
						<tr>
							<td colSpan={4}>
								<Spinner />
							</td>
						</tr>
					)}
					{users && !users.length && (
						<tr>
							<td colSpan={4} className="text-center">
								<div className="p-2">No Users To Display</div>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</Layout>
	)
}
