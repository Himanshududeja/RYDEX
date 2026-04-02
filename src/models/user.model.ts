import mongoose, { Mongoose } from "mongoose";

export interface IUser extends Document{     //extends Document means it will have all the properties of a mongoose document
    name: string;
    email: string;
    password?: string;  //? means optional field
    role:"user" | "admin" | "partner";  //role can be either user or admin or partner
    isEmailVerified?: boolean;     //? means optional field
    otp?: string;   //? means optional field
    otpExpiresAt?: Date;    //? means optional field
    partnerOnBoardingSteps:number
    mobileNumber?:string
    createdAt: Date
    updatedAt: Date
}
const userSchema = new mongoose.Schema<IUser>({   //<IUser> is the type of the document that will be created using this schema
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    role: {type: String, default: "user", enum: ["user", "admin", "partner"]},  //enum means the value of the field can only be one of the values in the array
    isEmailVerified: {type: Boolean, default: false},
    partnerOnBoardingSteps:{type:Number, min:0, max:8, default:0},
    mobileNumber:{type:String},
    otp: {type: String},
    otpExpiresAt: {type: Date}
},{timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);    //mongoose.models is an object that contains all the models that have been created using mongoose.model() method. If the model already exists, it will return the existing model, otherwise it will create a new model and return it.

export default User;