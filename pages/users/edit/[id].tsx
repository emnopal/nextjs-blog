import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { AddEdit } from '@/components/users/AddEdit';
import { Layout } from '@/components/users/Layout';
import { Spinner } from '@/components/Spinner';
import { alertHelper } from '@/lib/helper/alert';
import { userService } from '@/services/usersService';

export default Edit;

function Edit() {
    const router = useRouter();
    const { query } = router;
    const [user, setUser] = useState();

    useEffect(() => {
        const { id } = query;
        if (!id) return;

        // fetch user and set default form values if in edit mode
        userService.getById(id as string)
            .then(x => setUser(x))
            .catch(alertHelper.error)
    }, [query]);

    return (
        <Layout>
            <h1>Edit User</h1>
            {user ? <AddEdit user={user} /> : <Spinner />}
        </Layout>
    );
}