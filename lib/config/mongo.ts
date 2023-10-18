import getConfig from 'next/config';
import mongoose from 'mongoose';
import { userModel } from '@/models/usersModel';

const { serverRuntimeConfig } = getConfig();

try {
    mongoose.connect(serverRuntimeConfig.connectionString);
    mongoose.Promise = global.Promise;

    const connection = mongoose.connection;
    connection.on('connected', () => {
        console.info('MongoDB connected');
    })
    connection.on('error', (error: Error) => {
        console.error('MongoDB connection error.', serverRuntimeConfig.environmentMode === 'development' ? error : '');
        process.exit();
    })
} catch (error: unknown) {
    console.error("something went wrong");
    console.error(error as Error);
}

export const mongodb = {
    User: userModel()
};
