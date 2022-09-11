import mongoose from "mongoose";
const { Schema, model } = mongoose;

var UserSchema = new Schema({
	name: String,
	status: String,
	createdAt: { type: Date, default: Date.now }
});

const User = model('User', UserSchema);
export default User;