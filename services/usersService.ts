import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from '@/lib/api/fetch';
import { alertHelper } from '@/lib/helper/alert';
import { ICurrentAuthUserModel } from '../repository/usersRepository';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl.v1}/users`;

const userSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') as string));

async function login(username: string, password: string) {
    const user = await fetchWrapper.POST(`${baseUrl}/authenticate`, { username, password });
    userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    alertHelper.clear();
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

async function register(user: any) {
    await fetchWrapper.POST(`${baseUrl}/register`, user);
}

async function getAll() {
    return await fetchWrapper.GET(baseUrl, null);
}

async function getById(id: string) {
    return await fetchWrapper.GET(`${baseUrl}/${id}`, null);
}

async function update(id: string, params: any) {
    await fetchWrapper.PUT(`${baseUrl}/${id}`, params);

    if (id === userSubject.value.id) {

        const user = { ...userSubject.value, ...params };
        localStorage.setItem('user', JSON.stringify(user));

        userSubject.next(user);
    }
}

async function _delete(id: string) {
    await fetchWrapper.DELETE(`${baseUrl}/${id}`, null);

    if (id === userSubject.value.id) {
        logout();
    }
}

export const userService = {
    user: userSubject.asObservable(),
    get userValue(): ICurrentAuthUserModel { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};
