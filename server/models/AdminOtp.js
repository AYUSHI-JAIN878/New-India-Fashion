import mongoose from "mongoose";

const adminOtpSchema = new mongoose.Schema(
{
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
unique: true,
},
otpHash: {
type: String,
required: true,
},
expiresAt: {
type: Date,
required: true,
},
attempts: {
type: Number,
default: 0,
},
lastSentAt: {
type: Date,
required: true,
},
},
{ timestamps: true }
);

const AdminOtp = mongoose.model("AdminOtp", adminOtpSchema);
export default AdminOtp;
