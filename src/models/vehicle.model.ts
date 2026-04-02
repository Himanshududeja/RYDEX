import mongoose from "mongoose";

type vehicleType="bike" | "car" | "truck" | "van" | "auto"

interface IVehicle{
    owner: mongoose.Types.ObjectId,
    type: vehicleType,
    vehicleModel: string,
    number: string,
    imageUrl?: string,
    baseFare?: number,
    perKmFare?: number,
    waitingFare?: number,
    status: "approved" | "pending" | "rejected",
    rejectionReason?: string,
    isactive: boolean,
    createdAt: Date,
    updatedAt: Date
}

const vehicleSchema=new mongoose.Schema<IVehicle>({
    owner:{type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    type:{type:String, enum:["bike","car","truck","van","auto"], required:true},
    vehicleModel:{type:String, required:true},
    number:{type:String, required:true, unique:true},
    imageUrl:{type:String},
    baseFare:{type:Number, default:0},
    perKmFare:{type:Number},
    waitingFare:{type:Number},
    status:{type:String, enum:["approved","pending","rejected"], default:"pending"},
    rejectionReason:{type:String},
    isactive:{type:Boolean, default:true}
},{timestamps:true})

const Vehicle=mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema)

export default Vehicle