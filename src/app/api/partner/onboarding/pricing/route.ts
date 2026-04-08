import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 400 })
        }

        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ message: "partner not found" }, { status: 400 })
        }

        const vehicle = await Vehicle.findOne({owner:partner._id})
        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 400 })
        }

        const formData = await req.formData()
        const image=formData.get("image") as File | null
        const baseFare=formData.get("baseFare")
        const perKmFare=formData.get("perKmFare")
        const waitingFare=formData.get("waitingFare")

        let updated=false
        if(image && image.size>0){
            const imageUrl = await uploadOnCloudinary(image)
            vehicle.imageUrl=imageUrl
            updated=true
        }
        if(baseFare!==null){
            vehicle.baseFare=Number(baseFare)
            updated=true
        }
        if(perKmFare!==null){
            vehicle.perKmFare=Number(perKmFare)
            updated=true
        }
        if(waitingFare!==null){
            vehicle.waitingFare=Number(waitingFare)
            updated=true
        }
        if(updated==false){
            return Response.json({message:"Nothing to update"},{status:400})
        }

        vehicle.status="pending"
        vehicle.rejectionReason=undefined
        await vehicle.save()
        partner.partnerOnBoardingSteps=6
        await partner.save()
        return Response.json({message:"Pricing Submitted"},{status:200})
    }catch(error){
        return Response.json({message:`Pricing Error ${error}`},{status:500})
    }
}

export async function GET(){
    try{
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ message: "Unauthorized" }, { status: 400 })
        }

        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return Response.json({ message: "partner not found" }, { status: 400 })
        }

        const vehicle = await Vehicle.findOne({owner:partner._id})
        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 400 })
        }
        return Response.json(vehicle, { status: 200 })
    }catch(error){
        return Response.json({message:`Pricing get Error ${error}`},{status:500})
    }   
}