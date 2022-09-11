import mongoose from "mongoose";
const { Schema, model } = mongoose;

var RoomSchema = new Schema({
	name: String,
	active: Boolean,
	createdAt: { type: Date, default: Date.now }
});

const Room = model('Room', RoomSchema);
export default Room;