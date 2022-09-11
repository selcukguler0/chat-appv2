import mongoose from 'mongoose';
import Message from '../mongoDB/message-shema.js';
import Room from '../mongoDB/room-schema.js';
import User from '../mongoDB/users-schema.js';

// Connecting to database
var query = 'mongodb://root:ASrosTOS.2022@159.65.127.76:27017/chat-app?authSource=admin';
const db = (query);
mongoose.Promise = global.Promise;
mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, function (error) {
	if (error) {
		console.log("Error!" + error);
	}
});

var message = new Message({
	username: 'lawliet',
	message: 'selam selçuk',
	room: 'test'
});
message.save();

var room = new Room({
	name: 'lawliet',
	status: "active",
});
room.save();