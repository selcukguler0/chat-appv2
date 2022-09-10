import React from 'react'

function ProfileBox() {
	return (
		<div className="app-profile-box">
			<img
				src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80"
				alt="profile"
			/>
			<div className="app-profile-box-name">
				Pam Beesly Halpert
				<button className="app-setting">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={16}
						height={16}
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						className="feather feather-settings"
						viewBox="0 0 24 24"
					>
						<defs />
						<circle cx={12} cy={12} r={3} />
						<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
					</svg>
				</button>
			</div>
			<p className="app-profile-box-title">UI Designer</p>
			<div className="switch-status">
				<input
					type="checkbox"
					name="switchStatus"
					id="switchStatus"
					defaultChecked=""
				/>
				<label className="label-toggle" htmlFor="switchStatus" />
				<span className="toggle-text toggle-online">Online</span>
				<span className="toggle-text toggle-offline">Offline</span>
			</div>
		</div>
	)
}

export default ProfileBox