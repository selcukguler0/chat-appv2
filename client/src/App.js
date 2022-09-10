import './styles/App.css';

import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
const socket_url = process.env.REACT_APP_SOCKET_URL ||
	"http://localhost:3001";
var socket = io.connect(socket_url);

function App() {
	const [message, setMessage] = useState('');
	useEffect(() => {
		socket.on('connect', () => {
			socket.emit("join-room", "test");
			console.log('connected');
		});
		return () => {
			socket.off('connect');
		};
	}, []);

	const sendMessage = () => {
		socket.emit('message', message);
		setMessage('');
	};
	
	return (
		<div className="App">
			<input value={message} onChange={(e) => setMessage(e.target.value)} />
			<button onClick={sendMessage}>Send</button>
		</div>
	);
}

export default App;
