import mongoose from "mongoose";
import { Password } from "../helpers/password";


//interface listing attributes to create a new User
interface UserAttrs{
    email:string;
    password:string;
}

//interface holding User model properties
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs:UserAttrs):UserDoc
}

//interface that describers the properties that a user doc has
interface UserDoc extends mongoose.Document{
    email:string;
    password:string;
}

const userSchema = new mongoose.Schema({
    email :{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    toJSON:{
        transform(doc, ret) {
            ret.id = doc._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
})

//pre save hook to run password hashing
//limit scope of this key word use function not arrow functions.
userSchema.pre('save',async function (done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done();
})

userSchema.statics.build = (attrs:UserAttrs)=>new User(attrs);

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);


export {User};