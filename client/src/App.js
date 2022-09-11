import './styles/App.css';

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
			$('#password').attr('disabled', false);
		} else {
			$('#password').attr('disabled', true);
		}
	};

	const createRoom = (e) => {
		console.log("username", username);
		console.log("room", room);
		console.log("password", password);
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
			<div className="App">
				<form>
					<label htmlFor="password">Password</label>
					<input id="username" minLength={6} maxLength={12} placeholder="Enter your username" required={true} value={username} onChange={(e) => usernameHandler(e)} />
					<input id="password" type="password" minLength={6} maxLength={12} placeholder="Enter your password" required={true} value={password} onChange={(e) => setPassword(e.target.value)} disabled />
					<label onClick={() => createRoom(username, password)} className="login-button" htmlFor="login"><span>Enter</span>
						<svg>
							<path d="M10,17V14H3V10H10V7L15,12L10,17M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16H7V20H17V4H7V8H5V4A2,2 0 0,1 7,2Z"></path>
						</svg>
					</label>
					<div className="padlock">
						<div className="padlock__hook">
							<div className="padlock__hook-body"></div>
							<div className="padlock__hook-body"></div>
						</div>
						<div className="padlock__body">
							<div className="padlock__face">
								<div className="padlock__eye padlock__eye--left"></div>
								<div className="padlock__eye padlock__eye--right"></div>
								<div className="padlock__mouth padlock__mouth--one"></div>
								<div className="padlock__mouth padlock__mouth--two"></div>
								<div className="padlock__mouth padlock__mouth--three"></div>
							</div>
						</div>
					</div>
				</form>

			</div>
		</>
	);
}

export default App;
