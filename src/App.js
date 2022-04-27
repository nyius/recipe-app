import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Recipe from './pages/Recipe';
import Categories from './pages/Categories';
import Category from './pages/Category';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import { SearchProvider } from './context/search/SearchContext';

import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<SearchProvider>
			<Router>
				<Navbar />
				<div className="h-screen w-11/12 mx-auto flex flex-col justify-between">
					<Routes>
						<Route exact path="/" element={<Dashboard />} />
						<Route exact path="/categories" element={<Categories />} />
						<Route exact path="/category/:category" element={<Category />} />
						<Route exact path="/recipe/:id" element={<Recipe />} />
						<Route path="/*" element={<NotFound />} />
					</Routes>
					<ToastContainer />
					<Footer />
				</div>
			</Router>
		</SearchProvider>
	);
}

export default App;
