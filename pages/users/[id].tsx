import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { EditUser } from '@/components/users/Edit';
import { Layout } from '@/components/users/Layout';
import { Spinner } from '@/components/Spinner';
import { alertHelper } from '@/lib/helper/alert';
import { userService } from '@/services/usersService';
import { stringHelper } from '@/lib/helper/stringHelper';
import { type IUserModel } from '@/repository/usersRepository';


export default function Edit() {

    const router = useRouter();
    const { query } = router;
    const [user, setUser] = useState<IUserModel | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const { id, enable_edit } = query;
        if (!id) return;

        if (enable_edit) setIsDisabled(false)

        // fetch user and set default form values if in edit mode
        userService.getById(id as string)
            .then(x => setUser(x))
            .catch(alertHelper.error)
    }, [query]);

    const usernameStr = user?.username ?? ''

    // todo: implement profile
    const origNameStr = user?.name ?? ''
    const nameStr = stringHelper.toTitleCase(origNameStr)

    const setEditable = () => {
        setIsDisabled(false);
    };

    const setDisabled = () => {
        setIsDisabled(true);
    };

    return (
        <Layout>
            <h1>
                {nameStr} &nbsp;
                {isDisabled ?
                    <button onClick={setEditable} className="btn btn-primary btn-sm">
                        Edit
                    </button> : <button onClick={setDisabled} className="btn btn-warning btn-sm">
                        Cancel
                    </button>
                }
            </h1>
            {user ? <EditUser user={user} disableForms={isDisabled} /> : <Spinner />}
        </Layout>
    );
}