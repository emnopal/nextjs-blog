import Link from 'next/link';

import { userService } from '@/services/usersService';

export default function Home() {
    return (
        <div className="p-4">
            <div className="container">
                <h1 style={{color: 'black'}}>Hi {userService.userValue?.name}!</h1>
                <p style={{color: 'black'}}>You&lsquo;re logged in with Next.js & JWT!!</p>
                <p style={{color: 'black'}}><Link href="/users">Manage Users</Link></p>
            </div>
        </div>
    );
}