import { Server } from 'socket.io';
import cors from 'cors';
import { createServer } from "http";
//Mongoose
import mongoose from 'mongoose';
import Message from './mongoDB/message-shema.js';
import Room from './mongoDB/room-schema.js';
import User from './mongoDB/users-schema.js';
//create express app
import express from 'express';
const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/api/testMessage', (req, res) => {
	var message = new Message({
		username: 'test',
		message: 'test',
		room: 'test'
	});
	message.save();
	res.send(message);
});
app.get('/api/message-history', (req, res) => {
	const room = req.query.room;
	Message.find({ room: room }, (err, messages) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		} else {
			console.log(messages);
			return res.send(messages);
		}
	});
});
app.get('/api/room-activity', (req, res) => {
	const room = req.query.room;
	const username = req.query.username;
	var allMessages;
	var selfMessages;
	var roomAge;
	Message.find({ room: room }).sort({created: "asc"}).exec( (err, messages) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			allMessages = messages;
		}
	});
	Message.find({ room: room, username: username }, (err, messages) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			selfMessages = messages;
		}
	});
	Room.find({ name: room }, (err, room) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			roomAge = rooms.createdAt;
		}
	});
	return res.send({
		allMessages,
		selfMessages,
		roomAge
	});
});
//create server
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});

io.on('connection', (socket) => {
	var roomName;
	console.log('a user connected');
	socket.on('join-room', (room) => {
		roomName = room;
		socket.join(room);
		console.log('joined room: ' + room);
	});
	socket.on('message', ({message, room}) => {
		var message = new Message({
			username: 'test',
			message: message,
			room: room
		});
		message.save();
		console.log("message", message);
		io.emit('message', message);
	}
	);
});

httpServer.listen(3001);
