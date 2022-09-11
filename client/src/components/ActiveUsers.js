import React, { useEffect, useState } from 'react'

export default function ActiveUsers({ room, username, users }) {
	return (
		<div className="chat-list-wrapper">
			<div className="chat-list-header">
				Active Users <span className="c-number">{users.length}</span>
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
				{users?.map((user,i) => (
					<li key={i} className="chat-list-item">
						<img
							src={`https://avatars.dicebear.com/api/avataaars/${user.username}.svg`}
							alt="chat"
							lazyload="true"
						/>
						<span className="chat-list-name">{user.username}</span>
					</li>
				))}
			</ul>
		</div>
	)
}
