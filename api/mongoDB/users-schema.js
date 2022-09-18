import mongoose from "mongoose";
const { Schema, model } = mongoose;

var UserSchema = new Schema({
	username: String,
	room: String,
	status: String,
	socketId: String,
	createdAt: { type: Date, default: Date.now }
});

const User = model('User', UserSchema);
export default User;