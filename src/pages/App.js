import '../styles/App.css';

import React, { useState } from 'react';
import Helmet from 'react-helmet';
import $ from 'jquery';
import cryptoRandomString from 'crypto-random-string';
import { useNavigate } from 'react-router-dom';

function App() {
	const [username, setUsername] = useState("");
	const [room] = useState(cryptoRandomString({ length: 12, type: 'url-safe' }));
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const usernameHandler = (e) => {
		setUsername(e.target.value);
		if (e.target.value.length >= 6) {
			$('.randomPassword').attr('disabled', false);
			$('#password').attr('disabled', false);
		} else {
			$('.randomPassword').attr('disabled', true);
		}
	};

	const createRoom = (e) => {
		console.log("username", username);
		console.log("room", room);
		console.log("password", password);
		if (password || username.length >= 6) {
			fetch(`http://localhost:3001/api/create-room?username=${username}&room=${room}&password=${password}`)
				.then(res => res.json())
				.then(data => {
					if (data.message === "Room created") {
						localStorage.setItem('username', username);
						localStorage.setItem('room', room);
						localStorage.setItem('password', password);
						navigate(`/room/${room}`);
					}
				}
				);
		}
	}
	const createRandomPassword = (e) => {
		e.preventDefault();
		console.log("click");
		setPassword(cryptoRandomString({ length: 12 }));
		console.log(cryptoRandomString({ length: 12 }));
	}
	return (
		<>
			<Helmet>
				<link
					rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
				/>
				<link
					href="https://fonts.googleapis.com/css?family=Roboto:400,700,900"
					rel="stylesheet"
					type="text/css"
				/>
				<body className="bodyApp" />
			</Helmet>
			<div className="blurred-box">
				<div className="user-login-box">
					<h1 style={{color:"white"}}>Create Room Start Chatting</h1>
					<div className="user-name"></div>
					<div>
						<input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='Username' className="username" type="text" required={true} minLength={5} />
						<div style={{ position: "relative" }}>
							<input className="password" value={password} placeholder='Room Password' type="text" readOnly/>
							<button onClick={createRandomPassword} className='random-password'></button>
						</div>
						<button onClick={createRoom} className="user-login">Login</button>
					</div>
				</div>

			</div>
		</>
	);
}

export default App;
