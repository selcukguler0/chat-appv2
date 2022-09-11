import React, {useEffect, useState, useRef} from 'react'

function ChatPanel({ room, socket, username }) {
	const messageEl = useRef(null);
	const sendMessageRef = useRef(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	console.log("username",username);
	useEffect(() => {
		console.log(socket);
		//message history on load
		fetch(`http://localhost:3001/api/message-history?room=${room}`)
			.then(res => res.json())
			.then(data => {
				setMessages(data);
				console.log(data);
			});
		return () => {
			socket.off('connect');
			socket.off('join-room');
		};
	}, []);

	// get new messages
	useEffect(() => {
		socket.on('message', () => {
			fetch(`http://localhost:3001/api/message-history?room=${room}`)
				.then(res => res.json())
				.then(data => {
					setMessages(data);
					console.log(data);
				});
		});
		// return () => {
		// 	socket.off('message');
		// };
	}, [socket]);
	
	//auto-scrool to bottom
	useEffect(() => {
		console.log("scroll");
		if (messageEl) {
			messageEl.current?.scroll({
				top: messageEl.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	const sendMessage = () => {
		socket.emit('message', { message, username, room });
		setMessage('');
	};
	// document.body.addEventListener("keypress", function (event) {
	// 	// If the user presses the "Enter" key on the keyboard
	// 	if (event.key === "Enter") {
	// 		// Cancel the default action, if needed
	// 		event.preventDefault();
	// 		console.log("clicked enter");
	// 		document.getElementsByClassName("chat-send-btn")[0].click();
	// 	}
	// });
	return (
		<div className="app-main">
			<div ref={messageEl} className="chat-wrapper">
				{messages.map((message, i) => (
					message.username !== username ? (
						<div key={i} className="message-wrapper">
							<img
								className="message-pp"
								src={`https://avatars.dicebear.com/api/avataaars/${message.username }.svg`}
								alt="profile-pic"
							/>
							<div className="message-box-wrapper">
								<div className="message-box">{message.message}</div>
								<span>{message.username}</span>
							</div>
						</div>
					) : (
						<div key={i} className="message-wrapper reverse">
							<img
								className="message-pp"
									src={`https://avatars.dicebear.com/api/avataaars/${message.username}.svg`}
								alt="profile-pic"
							/>
							<div className="message-box-wrapper">
								<div className="message-box">
									{message.message}
								</div>
									<span>{message.username}</span>
							</div>
						</div>
					)))}


			</div>
			<div className="chat-input-wrapper">
				<button className="chat-attachment-btn">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={20}
						height={20}
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						className="feather feather-paperclip"
						viewBox="0 0 24 24"
					>
						<defs />
						<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
					</svg>
				</button>
				<div className="input-wrapper">
					<input
						ref={sendMessageRef}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="chat-input"
						placeholder="Enter your message here"
					/>
					<button className="emoji-btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={20}
							height={20}
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							className="feather feather-smile"
							viewBox="0 0 24 24"
						>
							<defs />
							<circle cx={12} cy={12} r={10} />
							<path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
						</svg>
					</button>
				</div>
				<button ref={sendMessageRef} onClick={sendMessage} className="chat-send-btn">Send</button>
			</div>
		</div>
	)
}

export default ChatPanel