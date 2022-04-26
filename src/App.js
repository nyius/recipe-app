import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Recipe from './pages/Recipe';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<Router>
			<Navbar />
			<div className="h-screen w-11/12 mx-auto flex flex-col justify-between">
				<Routes>
					<Route exact path="/" element={<Dashboard />} />
					<Route exact path="/recipe/:id" element={<Recipe />} />
				</Routes>
				<ToastContainer />
				<Footer />
			</div>
		</Router>
	);
}

export default App;
