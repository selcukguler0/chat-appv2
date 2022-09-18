import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import Room from "./pages/Room";

import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/room/:room" element={<Room />} />
		</Routes>
	</BrowserRouter>
);
