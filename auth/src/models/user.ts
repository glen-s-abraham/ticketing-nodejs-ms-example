import mongoose from "mongoose";


//Interface required to create a new User
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
})

userSchema.statics.build = (attrs:UserAttrs)=>new User(attrs);

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);


export {User};