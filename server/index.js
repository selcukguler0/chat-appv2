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

app.get('/api/active-users', (req, res) => {
	const room = req.query.room;
	User.find({ room: room }, (err, users) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			return res.send(users);
		}
	});
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

app.get('/api/room-exists', (req, res) => {
	const room = req.query.room;
	Room.find({ name: room }, (err, room) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			return res.send(room);
		}
	});
});
app.get('/api/create-room', (req, res) => {
	const username = req.query.username;
	const roomName = req.query.room;
	const password = req.query.password;

	Room.create({ name: roomName, password: password, status: "active" }, (err, room) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			User.create({ name: username, room: roomName, status: "" }, (err, user) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res.send({ message: "Room created", room: room.name, user: user.name });
				}
			});
		}
	});
});
app.get('/api/room-activity', (req, res) => {
	const room = req.query.room;
	const username = req.query.username;

	Message.find({ room: room }).sort({ created: "asc" }).exec((err, allMessages) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			Message.find({ room: room, username: username }, (err, selfMessages) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					Room.find({ name: room }, (err, room) => {
						if (err) {
							return res.status(500).send(err);
						} else {
							return res.send({
								allMessagesCount: allMessages.length,
								selfMessagesCount: selfMessages.length,
								roomAge: room[0].createdAt
							});
						}
					});
				}
			});
			
		}
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
	socket.on('message', ({message, username, room}) => {
		var message = new Message({
			username: username,
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
