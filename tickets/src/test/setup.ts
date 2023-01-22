import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose, { Collection } from 'mongoose';
import jwt from 'jsonwebtoken';
import request from "supertest";
import { app } from '../app';


declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo:any = new MongoMemoryServer();
beforeAll(async()=>{
    process.env.JWT_KEY = 'key';
    //mongo = await MongoMemoryServer.create();
    //const mongoUri = await mongo.getUri();
    const mongoUri = 'mongodb://localhost:27017/test'//await mongo.getUri();
    await mongoose.connect(mongoUri);
})

beforeEach(async()=>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async ()=>{
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({})
    }
    await mongoose.connection.close();
})

global.signin = ()=>{
    //build jwt payload {id,email}
    //create jwt
    const token = jwt.sign({id:new mongoose.Types.ObjectId().toHexString(),email:'test@test.com'},process.env.JWT_KEY)
    //build session object {jwt:MY_JWT}
    //Turn session to JSON
    //encode JSON to base64
    const base64 =  Buffer.from(JSON.stringify({jwt:token})).toString('base64');
    //return a string thats a cookie with encoded data
    return [`session=${base64}`];
}