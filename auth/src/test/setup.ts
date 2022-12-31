import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose, { Collection } from 'mongoose';
import { app } from '../app';

let mongo:any = new MongoMemoryServer();
beforeAll(async()=>{
    process.env.JWT_KEY = 'key';
    //mongo = await MongoMemoryServer.create();
    //const mongoUri = await mongo.getUri();
    const mongoUri = 'mongodb://localhost:27017'//await mongo.getUri();
    await mongoose.connect(mongoUri);
})

beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close();
})