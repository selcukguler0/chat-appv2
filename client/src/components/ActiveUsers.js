import React from 'react'

export default function ActiveUsers({ room }) {
	return (
		<div className="chat-list-wrapper">
			<div className="chat-list-header">
				Active Conversations <span className="c-number">4</span>
				<svg
					className="list-header-arrow"
					xmlns="http://www.w3.org/2000/svg"
					width={16}
					height={16}
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={3}
					viewBox="0 0 24 24"
				>
					<defs />
					<path d="M18 15l-6-6-6 6" />
				</svg>
			</div>
			<ul className="chat-list active">
				<li className="chat-list-item active">
					<img
						src="https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
						alt="chat"
					/>
					<span className="chat-list-name">Dwight Schrute</span>
				</li>
				<li className="chat-list-item">
					<img
						src="https://images.unsplash.com/photo-1566465559199-50c6d9c81631?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
						alt="chat"
					/>
					<span className="chat-list-name">Andy Bernard</span>
				</li>

			</ul>
		</div>
	)
}
