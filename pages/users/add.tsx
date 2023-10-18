import { AddUser } from '@/components/users/Add';
import { Layout } from '@/components/users/Layout';

export default Add;

function Add() {
    return (
        <Layout>
            <h1>Add User</h1>
            <AddUser />
        </Layout>
    );
}