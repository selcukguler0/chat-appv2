import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import $ from 'jquery';
import Helmet from 'react-helmet';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Room.css';

import ChatPanel from '../components/ChatPanel';
import ActiveUsers from '../components/ActiveUsers';
import RoomHeader from '../components/RoomHeader';
import ProfileBox from '../components/ProfileBox';
import RoomActivityBox from '../components/RoomActivityBox';

import io from "socket.io-client";
const socket_url = process.env.REACT_APP_SOCKET_URL ||
	"http://localhost:3001";
var socket = io.connect(socket_url);

export default function Room() {
	let { room } = useParams();
	const [roomExists, setRoomExists] = useState(false);
	const [roomData, setRoomData] = useState({});
	const [accessRoom, setAccessRoom] = useState(false);
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [users, setUsers] = useState([]);
	const [socketId, setSocketId] = useState('');

	useEffect(() => {
		socket.on('connect', () => {
			console.log("socked id: " + socket.id);
			setSocketId(socket.id);
		});
		// check room exists
		fetch(`http://localhost:3001/api/room-exists?room=${room}`)
			.then(res => res.json())
			.then(room => {
				if (room) {
					console.log(room[0]);
					if (room[0].status === "active") {
						setRoomData(room[0]);
						setRoomExists(true);
					}
				} else {
					setRoomExists(false);
				}
			});

		fetch(`http://localhost:3001/api/active-users?room=${room}`)
			.then(res => res.json())
			.then(users => {
				console.log(users);
				var filteredUsers = users.filter(user => user.status === 'online')
					.filter(user => user.username !== username);
				console.log(filteredUsers);
				setUsers(filteredUsers);
			}
		);
		localStorage.setItem('room', room);
	}, [])
	const usernameHandler = (e) => {
		console.log("username: " + e.target.value);
		setUsername(e.target.value);
		if (e.target.value.length >= 6) {
			$('#password').attr('disabled', false);
		} else {
			$('#password').attr('disabled', true);
		}
	};
	//send message with enter key and focus to message input
	useEffect(() => {
		const keyDownHandler = event => {
			console.log('User pressed: ', event.key);

			if (event.key === 'Enter') {
				event.preventDefault();

				document.getElementsByClassName('chat-input')[0].focus();
				document.getElementsByClassName('chat-send-btn')[0].click();
			}
		};

		document.addEventListener('keydown', keyDownHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
		};
	}, []);
	const roomLogin = () => {
		if (password === roomData.password) {
			fetch(`http://localhost:3001/api/user-exists?username=${username}&room=${room}`)
				.then(res => res.json())
				.then(user => {
					if (user.length === 0) {
						setAccessRoom(true);
						console.log("setting username", username);
						localStorage.setItem('password', password);
						localStorage.setItem('username', username);
						console.log("user does not exist");
						fetch(`http://localhost:3001/api/create-user?username=${username}&room=${room}`)
							.then(res => res.json())
							.then(user => localStorage.setItem("username", username));
					}
					else {
						setAccessRoom(false);
						const notify = () => toast.error('User Exists!', {
							position: "top-right",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						});
						notify();
						console.log("user exists");
					}
				});
		} else {
			setAccessRoom(false);
			toast.error('Password is not correct!', {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}
	if (!roomExists) {
		return (
			<div>Room not exists</div>
		)
	}

	//wait for dom for use localstorage
	if (typeof window !== "undefined") {
		if (!accessRoom) {
			if (roomData.password) {
				if (localStorage.getItem("password") === roomData.password
					&& localStorage.getItem("room") === room) {
					setUsername(localStorage.getItem("username"));
					setAccessRoom(true);
				}
				return (
					<>
						<ToastContainer
							position="top-right"
							autoClose={3000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
						/>
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
								<h1 style={{ color: "white" }}>Join Room Start Chatting</h1>
								<div className="user-name"></div>
								<div>
									<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' className="username" type="text" required={true} minLength={5} />
									<div style={{ position: "relative" }}>
										<input className="password" value={password}
											onChange={(e)=>setPassword(e.target.value)} placeholder='Room Password' type="text" />
									</div>
									<button onClick={roomLogin} className="user-login">Join Room</button>
								</div>
							</div>

						</div>
					</>
				)
			}
			//if room not protected
			else {
				console.log("setting username room not protected");
				setUsername(localStorage.getItem("username"));
				setAccessRoom(true);
			}
		}
	}

	if (accessRoom) {
		fetch(`http://localhost:3001/api/set-socket?username=${username}&room=${room}&socketId=${socketId}`)
			.then(res => res.json())
			.then(data => console.log(data));

		socket.emit('join-room', {room, username});
	}
	return (
		<>
			<div className="app-container">
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<div className="app-left">
					<RoomHeader room={room} />
					<ProfileBox room={room} username={username} />
					<ActiveUsers room={room} username={username} socket={socket} />
				</div>
				<ChatPanel room={room} socket={socket} username={username} />
				<div className="app-right">
					<RoomActivityBox room={room} socket={socket} username={username} users={users} />
				</div>
				{/* //TODO - Add Theme Picker */}
				{/* <div className="app-right-bottom">
				<div className="app-theme-selector">
					<button className="theme-color indigo" data-color="indigo">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={512}
							height={512}
							viewBox="0 0 512 512"
							title="Indigo"
						>
							<defs />
							<path
								fill="#fff"
								d="M451.648.356c-25.777 2.712-56.79 19.872-94.811 52.46-68.786 58.958-149.927 160.756-202.185 234-38.158-5.951-78.375 10.368-102.187 40.133C8.758 381.584 45.347 430.34 4.12 473.811c-7.179 7.569-4.618 20.005 4.98 24.114 67.447 28.876 153.664 10.879 194.109-31.768 24.718-26.063 38.167-64.54 31.411-100.762 72.281-55.462 172.147-140.956 228.7-211.885 31.316-39.277 47.208-70.872 48.584-96.59C513.759 22.273 486.87-3.346 451.648.356zM181.443 445.511c-27.362 28.85-87.899 45.654-141.767 31.287 30.12-48.043 4.229-91.124 36.214-131.106 26.246-32.808 79.034-41.993 109.709-11.317 35.839 35.843 19.145 86.566-4.156 111.136zm3.07-148.841c7.354-10.167 18.887-25.865 33.29-44.659l49.22 49.224c-18.125 14.906-33.263 26.86-43.077 34.494-8.842-15.879-22.526-30.108-39.433-39.059zM481.948 55.316c-3.368 63.004-143.842 186.021-191.797 226.621l-53.785-53.79c39.458-49.96 155.261-191.312 218.422-197.954 16.851-1.775 28.03 8.858 27.16 25.123z"
							/>
						</svg>
					</button>
					<button className="theme-color pink" data-color="pink" title="Pink">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={512}
							height={512}
							viewBox="0 0 512 512"
						>
							<defs />
							<path
								fill="#fff"
								d="M451.648.356c-25.777 2.712-56.79 19.872-94.811 52.46-68.786 58.958-149.927 160.756-202.185 234-38.158-5.951-78.375 10.368-102.187 40.133C8.758 381.584 45.347 430.34 4.12 473.811c-7.179 7.569-4.618 20.005 4.98 24.114 67.447 28.876 153.664 10.879 194.109-31.768 24.718-26.063 38.167-64.54 31.411-100.762 72.281-55.462 172.147-140.956 228.7-211.885 31.316-39.277 47.208-70.872 48.584-96.59C513.759 22.273 486.87-3.346 451.648.356zM181.443 445.511c-27.362 28.85-87.899 45.654-141.767 31.287 30.12-48.043 4.229-91.124 36.214-131.106 26.246-32.808 79.034-41.993 109.709-11.317 35.839 35.843 19.145 86.566-4.156 111.136zm3.07-148.841c7.354-10.167 18.887-25.865 33.29-44.659l49.22 49.224c-18.125 14.906-33.263 26.86-43.077 34.494-8.842-15.879-22.526-30.108-39.433-39.059zM481.948 55.316c-3.368 63.004-143.842 186.021-191.797 226.621l-53.785-53.79c39.458-49.96 155.261-191.312 218.422-197.954 16.851-1.775 28.03 8.858 27.16 25.123z"
							/>
						</svg>
					</button>
					<button
						className="theme-color navy-dark active"
						data-color="navy-dark"
						title="Navy Dark"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={512}
							height={512}
							viewBox="0 0 512 512"
						>
							<defs />
							<path
								fill="#fff"
								d="M451.648.356c-25.777 2.712-56.79 19.872-94.811 52.46-68.786 58.958-149.927 160.756-202.185 234-38.158-5.951-78.375 10.368-102.187 40.133C8.758 381.584 45.347 430.34 4.12 473.811c-7.179 7.569-4.618 20.005 4.98 24.114 67.447 28.876 153.664 10.879 194.109-31.768 24.718-26.063 38.167-64.54 31.411-100.762 72.281-55.462 172.147-140.956 228.7-211.885 31.316-39.277 47.208-70.872 48.584-96.59C513.759 22.273 486.87-3.346 451.648.356zM181.443 445.511c-27.362 28.85-87.899 45.654-141.767 31.287 30.12-48.043 4.229-91.124 36.214-131.106 26.246-32.808 79.034-41.993 109.709-11.317 35.839 35.843 19.145 86.566-4.156 111.136zm3.07-148.841c7.354-10.167 18.887-25.865 33.29-44.659l49.22 49.224c-18.125 14.906-33.263 26.86-43.077 34.494-8.842-15.879-22.526-30.108-39.433-39.059zM481.948 55.316c-3.368 63.004-143.842 186.021-191.797 226.621l-53.785-53.79c39.458-49.96 155.261-191.312 218.422-197.954 16.851-1.775 28.03 8.858 27.16 25.123z"
							/>
						</svg>
					</button>
					<button className="theme-color dark" data-color="dark" title="Dark">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={512}
							height={512}
							viewBox="0 0 512 512"
						>
							<defs />
							<path
								fill="currentColor"
								d="M451.648.356c-25.777 2.712-56.79 19.872-94.811 52.46-68.786 58.958-149.927 160.756-202.185 234-38.158-5.951-78.375 10.368-102.187 40.133C8.758 381.584 45.347 430.34 4.12 473.811c-7.179 7.569-4.618 20.005 4.98 24.114 67.447 28.876 153.664 10.879 194.109-31.768 24.718-26.063 38.167-64.54 31.411-100.762 72.281-55.462 172.147-140.956 228.7-211.885 31.316-39.277 47.208-70.872 48.584-96.59C513.759 22.273 486.87-3.346 451.648.356zM181.443 445.511c-27.362 28.85-87.899 45.654-141.767 31.287 30.12-48.043 4.229-91.124 36.214-131.106 26.246-32.808 79.034-41.993 109.709-11.317 35.839 35.843 19.145 86.566-4.156 111.136zm3.07-148.841c7.354-10.167 18.887-25.865 33.29-44.659l49.22 49.224c-18.125 14.906-33.263 26.86-43.077 34.494-8.842-15.879-22.526-30.108-39.433-39.059zM481.948 55.316c-3.368 63.004-143.842 186.021-191.797 226.621l-53.785-53.79c39.458-49.96 155.261-191.312 218.422-197.954 16.851-1.775 28.03 8.858 27.16 25.123z"
							/>
						</svg>
					</button>
				</div>
			</div> */}
			</div>

		</>
	)
}
