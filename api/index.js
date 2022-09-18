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
	User.find({ room: room, status: "online" }, (err, users) => {
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
app.get('/api/user-exists', (req, res) => {
	const username = req.query.username;
	const room = req.query.room;
	User.find({ username: username, room: room }, (err, user) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			return res.send(user);
		}
	});
});
app.get('/api/create-user', (req, res) => {
	const username = req.query.username;
	const roomName = req.query.room;

	User.create({ username: username, room: roomName, status: "online", socketId: "" }, (err, user) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			return res.send({ message: "User created", roomName, username });
		}
	});
});
app.get('/api/set-socket', (req, res) => {
	const username = req.query.username;
	const roomName = req.query.room;
	const socketId = req.query.socketId;
	User.findOneAndUpdate({ username: username, room: roomName },
		{ socketId: socketId, status: "online" }, (err, user) => {
			if (err) {
				return res.status(500).send(err);
			} else {
				return res.send({ message: "Socket set" });
			}
		}
	);
});
app.get('/api/create-room', (req, res) => {
	const username = req.query.username;
	const roomName = req.query.room;
	const password = req.query.password;

	Room.create({ name: roomName, password: password, status: "active" }, (err, room) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			User.create({ username: username, room: roomName, status: "online", socketId: "" }, (err, user) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res.send({ message: "Room created", roomName, username });
				}
			});
		}
	});
});
app.get('/api/room-activity', (req, res) => {
	const roomName = req.query.room;
	const username = req.query.username;

	Message.find({ room: roomName }).sort({ created: "asc" }).exec((err, allMessages) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			Message.find({ room: roomName, username: username }, (err, selfMessages) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					Room.find({ name: roomName }, (err, room) => {
						if (err) {
							return res.status(500).send(err);
						} else {
							User.find({ room: roomName, status: "online" }, (err, users) => {
								if (err) {
									return res.status(500).send(err);
								}
								else {
									return res.send({
										allMessagesCount: allMessages.length,
										selfMessagesCount: selfMessages.length,
										roomAge: room[0].createdAt,
										activeUsers: users.length
									});
								}
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
	socket.on('join-room', ({ room, username }) => {
		roomName = room;
		socket.join(room);
		new Message({
			username: "system-bot",
			message: `${username} has joined the room`,
			room: room
		}).save();
		io.emit('user-connected', username);
		console.log('joined room: ' + room);
		console.log('joined username: ' + username);
	});
	socket.on('message', ({ message, username, room }) => {
		new Message({
			username: username,
			message: message,
			room: room
		}).save();
		console.log("message", message);
		io.emit('message', message);
	}
	);
	socket.on('disconnect', () => {
		console.log(socket.id, 'user disconnected');
		User.findOne({ socketId: socket.id }, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				new Message({
					username: "system-bot",
					message: `${user.username} has left the room`,
					room: roomName
				}).save();
			}
		}
		);
		io.emit('user-disconnected');
		User.findOneAndUpdate({ socketId: socket.id }, { status: "offline" }, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				console.log("user disconnected");
			}
		}
		);
	});
});

httpServer.listen(3001);
console.log("port 3001")
