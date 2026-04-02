import  connectDb  from "@/lib/db"
import { auth } from "@/auth"
import User from "@/models/user.model"

export async function GET(req:Request){
    try{
        await connectDb()
        const session=await auth()
        if(!session || !session.user){
            return Response.json({message:"User is not authenticated"},{status:401})
        }
        const user=await User.findOne({email:session.user.email})
        if(!user){
            return Response.json({message:"User not found"},{status:404})
        }
        return Response.json(user,{status:200})

    }catch(error){
        return Response.json({message:"get me Error ${error}"},{status:500})
    }
}