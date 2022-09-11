import './styles/App.css';

import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import $ from 'jquery';

import io from "socket.io-client";
const socket_url = process.env.REACT_APP_SOCKET_URL ||
	"http://localhost:3001";
var socket = io.connect(socket_url);

function App() {
	const [message, setMessage] = useState('');
	useEffect(() => {
		socket.on('connect', () => {
			console.log('connected');
		});
		return () => {
			socket.off('connect');
		};
	}, []);

	useEffect(() => {
		$('.username').on("change keyup paste",
			function () {
				if ($(this).val().length > 5) {
					$('.icon-paper-plane').addClass("next");
				} else {
					$('.icon-paper-plane').removeClass("next");
				}
			}
		);

		$('.next-button.username').on("click",
			function () {
				console.log("Something");
				$('.username-section').addClass("fold-up");
				$('.room-name-section').removeClass("folded");
			}
		);
		$('.room-name').on("change keyup paste",
			function () {
				if ($(this).val().length > 5) {
					$('.icon-paper-plane').addClass("next");
				} else {
					$('.icon-paper-plane').removeClass("next");
				}
			}
		);

		$('.next-button.room-name').on("click",
			function () {
				console.log("Something");
				$('.room-name-section').addClass("fold-up");
				$('.password-section').removeClass("folded");
			}
		);

		$('.password').on("change keyup paste",
			function () {
				if ($(this).val().length > 5) {
					$('.icon-lock').addClass("next");
					
				} else {
					$('.icon-lock').removeClass("next");
				}
			}
		);
		$('.next-button').on("mouseenter",
			function () {
				$(this).css('cursor', 'pointer');
			}
		);
		$('.next-button.password').on("click",
			function () {
				console.log("Something");
				$('.password-section').addClass("fold-up");
				$('.success').css("marginTop", 0);
			}
		);
	}, []);

	const sendMessage = () => {
		socket.emit('message', message);
	};
	
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
			</Helmet>
			<div className="App">
				<h1>Chat with your Friends.</h1>
				<>
					<div className="back" />
					<div className="registration-form">
						<header>
							<h1>Create Room</h1>
							<p>Start chatting</p>
						</header>
						<form>
							<div className="input-section username-section">
								<input
									className="username"
									type="text"
									placeholder="ENTER YOUR USERNAME"
									autoComplete="off"
								/>
								<div className="animated-button">
									<span className="icon-paper-plane">
										<i className="fa fa-home" />
									</span>
									<span className="next-button username">
										<i className="fa fa-arrow-up" />
									</span>
								</div>
							</div>
							<div className="input-section room-name-section folded">
								<input
									className="room-name"
									type="text"
									placeholder="ENTER YOUR ROOM NAME"
									autoComplete="off"
								/>
								<div className="animated-button">
									<span className="icon-paper-plane">
										<i className="fa fa-home" />
									</span>
									<span className="next-button room-name">
										<i className="fa fa-arrow-up" />
									</span>
								</div>
							</div>
							<div className="input-section password-section folded">
								<input
									className="password"
									type="password"
									placeholder="ENTER YOUR ROOM PASSWORD"
								/>
								<div className="animated-button">
									<span className="icon-lock">
										<i className="fa fa-lock" />
									</span>
									<span className="next-button password">
										<i className="fa fa-arrow-up" />
									</span>
								</div>
							</div>
							
							<div className="success">
								<p>ROOM CREATED</p>
							</div>
						</form>
					</div>
				</>

			</div>
		</>
	);
}

export default App;
