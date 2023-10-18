import getConfig from 'next/config';
import mongoose from 'mongoose';
import { userModel } from '@/models/usersModel';

const { serverRuntimeConfig } = getConfig();

try {
    mongoose.connect(serverRuntimeConfig.connectionString);
    mongoose.Promise = global.Promise;

    const connection = mongoose.connection;
} catch (error: unknown) {
    console.error("something went wrong");
    console.error(error as Error);
}

export const mongodb = {
    User: userModel()
};
