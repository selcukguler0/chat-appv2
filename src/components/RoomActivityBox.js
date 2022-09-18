import React,{useState, useEffect} from 'react'
import { BsPeople, BsClock } from 'react-icons/bs';
import { TiMessage, TiMessages } from 'react-icons/ti';
export default function RoomActivityBox({ room, socket, username, users }) {
	const [data, setData] = useState([])
	// date difference in day => Math.ceil(time diff / (1000 * 60 * 60 * 24)); 
	const RoomAge = (date) => {
		const diff = new Date() - new Date(date.roomAge)
		console.log(diff);
		if (diff / (1000 * 60 * 60) >= 24) {
			return Math.ceil( diff / (1000 * 60 * 60 * 24)).toString() + " days"
		}
		else if (diff / (1000 * 60 * 60) < 24 && diff / (1000 * 60 * 60) >= 1) {
			return Math.ceil(diff / (1000 * 60 * 60)).toString() + " hours"
		}
		return Math.ceil(diff / (1000 * 60)).toString() + " minutes"
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
			console.log("message received");
			room && fetch(`http://localhost:3001/api/room-activity?room=${room}&username=${username}`)
				.then(response => response.json())
				.then(data => setData(data));
		});
		socket.on('user-connected', () => {
			console.log("user connected");
			fetch(`http://localhost:3001/api/room-activity?room=${room}&username=${username}`)
				.then(response => response.json())
				.then(data => setData(data));
		});
		socket.on('user-disconnected', () => {
			console.log("user disconnected");
			fetch(`http://localhost:3001/api/room-activity?room=${room}&username=${username}`)
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
						<BsClock />
					</div>
					<div className="info-text-wrapper">
						<span className="info-text-upper">{RoomAge(data)}</span>
						<span className="info-text-bottom">Time</span>
					</div>
				</div>
				<div className="activity-info-box atendee">
					<div className="info-icon-wrapper">
						<BsPeople />
					</div>
					<div className="info-text-wrapper">
						{/* (+1) including self */}
						<span className="info-text-upper">{data.activeUsers}</span>
						<span className="info-text-bottom">Active Users</span>
					</div>
				</div>
				<div className="activity-info-box meeting">
					<div className="info-icon-wrapper">
						<TiMessages />
					</div>
					<div className="info-text-wrapper">
						<span className="info-text-upper">{data.allMessagesCount}</span>
						<span className="info-text-bottom">All Messages</span>
					</div>
				</div>
				<div className="activity-info-box reject">
					<div className="info-icon-wrapper">
						<TiMessage/>
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
