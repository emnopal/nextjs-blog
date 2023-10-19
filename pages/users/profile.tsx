import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { EditUser } from '@/components/users/Edit';
import { Layout } from '@/components/users/Layout';
import { Spinner } from '@/components/Spinner';
import { alertHelper } from '@/lib/helper/alert';
import { userService } from '@/services/usersService';
import { stringHelper } from '@/lib/helper/stringHelper';


export default function Edit() {

    const router = useRouter();
    const { query } = router;
    const [user, setUser] = useState();
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        const id = userService.userValue?.id
        const { enable_edit } = query;
        if (!id) return;

        if (enable_edit) setIsDisabled(false)

        // fetch user and set default form values if in edit mode
        userService.getById(id as string)
            .then(x => setUser(x))
            .catch(alertHelper.error)
    }, [query]);

    const usernameStr = userService.userValue?.username ?? ''
    const origNameStr = userService.userValue?.name ?? ''
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
                Hi {nameStr} &nbsp;
                {isDisabled ?
                    <button onClick={setEditable} className="btn btn-primary btn-sm">
                        Edit
                    </button> : <button onClick={setDisabled} className="btn btn-warning btn-sm">
                        Cancel
                    </button>
                }
            </h1>
            {user ? <EditUser user={user} disableForms={isDisabled} isProfile /> : <Spinner />}
        </Layout>
    );
}