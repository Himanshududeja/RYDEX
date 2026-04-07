import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const partner=await User.find({
            role:"partner",
            partnerOnBoardingSteps:4,
            videoKycStatus:{$in:["pending","in_progress"]}
        })
        return Response.json(partner,{status:200})
    } catch (error) {
        Response.json({message:`Partner KYC error ${error}`},{status:500})
    }
}