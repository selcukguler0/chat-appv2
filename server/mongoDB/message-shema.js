import mongoose from 'mongoose';
const { Schema, model } = mongoose;

var MessageSchema = new mongoose.Schema({
	username: String,
	message: String,
	room: String,
	created: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;