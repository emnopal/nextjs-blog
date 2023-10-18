import Link from 'next/link';

import { userService } from '@/services/usersService';
import { stringHelper } from '@/lib/helper/stringHelper';
import { useEffect, useState } from 'react';

export default function Home() {

    const [nameStr, setNameStr] = useState<string | null>(null)

    useEffect(() => {
        const origNameStr = userService.userValue?.name
        const nameStrTitle = stringHelper.toTitleCase(origNameStr)
        setNameStr(nameStrTitle)
    }, []);

    return (
        <div className="p-4">
            <div className="container">
                <h1 >Hi {nameStr}!</h1>
                <p >You&lsquo;re logged in with Next.js & JWT!!</p>
                <p ><Link href="/users">Manage Users</Link></p>
            </div>
        </div>
    );
}
