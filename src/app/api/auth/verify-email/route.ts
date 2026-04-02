import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(req: Request) {
    try{
        await connectDb();
        const {email, otp} = await req.json();
        if(!email && !otp){
            return Response.json(
                {message:"Email and OTP are required"},
                {status:400}
            )
        }

        let user = await User.findOne({email});
        if(!user){
            return Response.json(
                {message:"User not found"},
                {status:404}
            )
        }
        if(user.isemailVerified){
            return Response.json(
                {message:"Email already verified"},
                {status:400}
            )
        }
        if(!user.otpExpiresAt || user.otpExpiresAt < new Date()){
            return Response.json(
                {message:"OTP expired"},
                {status:400}
            )
        }
        if(!user.otp || user.otp !== otp){
            return Response.json(
                {message:"Invalid OTP"},
                {status:400}
            )
        }

        user.isEmailVerified=true;
        user.otp=undefined;
        user.otpExpiresAt=undefined;
        await user.save();

        return Response.json(
            {message:"Email verified successfully"},
            {status:200}
        )
    }catch(error){
        console.error("Error occurred while verifying email:", error);
        return Response.json(
            {message:"Verifying email failed"},
            {status:500}
        )
    }
}