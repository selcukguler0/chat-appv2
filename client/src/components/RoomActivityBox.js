import React,{useState, useEffect} from 'react'

export default function RoomActivityBox({ room, socket, username, users }) {
	const [data, setData] = useState([])
	// date difference in day => Math.ceil(time diff / (1000 * 60 * 60 * 24)); 
	const RoomAge = (date) => {
		const diff = new Date() - new Date(date.roomAge)
		if (diff / (1000 * 60 * 60) >= 24) {
			return Math.ceil( diff / (1000 * 60 * 60 * 24)).toString() + " days"
		}
		else if (diff / (1000 * 60 * 60) < 24) {
			return Math.ceil(diff / (1000 * 60 * 60)).toString() + " hours"
		}
		return Math.ceil(diff / (1000 * 60 * 60 * 24)).toString() + " minutes"
	}

	//get data at beginning
	useEffect(() => {
		room && fetch(`http://localhost:3001/api/room-activity?room=${room}&username=${username}`)
			.then(response => response.json())
			.then(data => setData(data));
	}, []);

	//get data when new message comes
	useEffect(() => {
		socket.on('message', () => {
			room && fetch(`http://localhost:3001/api/room-activity?room=${room}&username=${username}`)
				.then(response => response.json())
				.then(data => setData(data));
		});
		// return () => {
		// 	socket.off('message');
		// };
	}, [socket]);

	if (data.length === 0) {
		return <div>Loading Room Info...</div>
	}
	return (
		<div className="app-activity-box">
			<div className="activity-info-boxes">
				<div className="activity-info-box time">
					<div className="info-icon-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={24}
							height={24}
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							className="feather feather-clock"
							viewBox="0 0 24 24"
						>
							<defs />
							<circle cx={12} cy={12} r={10} />
							<path d="M12 6v6l4 2" />
						</svg>
					</div>
					<div className="info-text-wrapper">
						<span className="info-text-upper">{RoomAge(data)}</span>
						<span className="info-text-bottom">Time</span>
					</div>
				</div>
				<div className="activity-info-box atendee">
					<div className="info-icon-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={24}
							height={24}
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							className="feather feather-users"
							viewBox="0 0 24 24"
						>
							<defs />
							<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
							<circle cx={9} cy={7} r={4} />
							<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
						</svg>
					</div>
					<div className="info-text-wrapper">
						{/* (+1) including self */}
						<span className="info-text-upper">{users.length + 1}</span>
						<span className="info-text-bottom">Active Users</span>
					</div>
				</div>
				<div className="activity-info-box meeting">
					<div className="info-icon-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={24}
							height={24}
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							className="feather feather-calendar"
							viewBox="0 0 24 24"
						>
							<defs />
							<rect width={18} height={18} x={3} y={4} rx={2} ry={2} />
							<path d="M16 2v4M8 2v4M3 10h18" />
						</svg>
					</div>
					<div className="info-text-wrapper">
						<span className="info-text-upper">{data.allMessagesCount}</span>
						<span className="info-text-bottom">All Messages</span>
					</div>
				</div>
				<div className="activity-info-box reject">
					<div className="info-icon-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={24}
							height={24}
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							className="feather feather-x-square"
							viewBox="0 0 24 24"
						>
							<defs />
							<rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
							<path d="M9 9l6 6M15 9l-6 6" />
						</svg>
					</div>
					<div className="info-text-wrapper">
						<span className="info-text-upper">{data.selfMessagesCount}</span>
						<span className="info-text-bottom">Self Messages</span>
					</div>
				</div>
			</div>
			{/* <div className="activity-info-header">
				<span className="info-header-bold">Current Week</span>
				<span className="info-header-light">Activity</span>
			</div> */}
			{/* // TODO : Add chart here basic on days */}
			{/* <div className="activity-days-wrapper">
				<div className="day">
					<div className="chart" />
					<span>MON</span>
				</div>
				<div className="day">
					<div className="chart" />
					<span>TUE</span>
				</div>
				<div className="day current">
					<div className="chart" />
					<span>WED</span>
				</div>
				<div className="day">
					<div className="chart" />
					<span>THU</span>
				</div>
				<div className="day">
					<div className="chart" />
					<span>FRI</span>
				</div>
				<div className="day">
					<div className="chart" />
					<span>SAT</span>
				</div>
				<div className="day">
					<div className="chart" />
					<span>SUN</span>
				</div>
			</div> */}
		</div>
	)
}
