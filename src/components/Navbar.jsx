import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiCake3Line } from 'react-icons/ri';
import { AiOutlineSmile } from 'react-icons/ai';
import { BsFillBookmarksFill } from 'react-icons/bs';
import Spinner from './Spinner';
import SearchContext from '../context/search/SearchContext';
import CategoriesContext from '../context/categories/CategoriesContext';

function Navbar() {
	const navigate = useNavigate();
	const [bookmarkLoading, setBookmarkLoading] = useState(true);
	const [bookmarks, setBookmarks] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const { search, dispatch } = useContext(SearchContext);
	const { categories, loading: categoriesLoading } = useContext(CategoriesContext);

	// Get Bookmarks & Categories ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		setBookmarks(() => {
			const bookmarksStorage = JSON.parse(localStorage.getItem('bookmarks'));
			if (bookmarksStorage === null) {
				return [];
			} else {
				return bookmarksStorage;
			}
		});

		setBookmarkLoading(false);
	}, []);

	// Listen for new bookmarks ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		window.addEventListener('storage', () => {
			setBookmarks(() => {
				const bookmarksStorage = JSON.parse(localStorage.getItem('bookmarks'));
				if (bookmarksStorage === null) {
					return [];
				} else {
					return bookmarksStorage;
				}
			});
		});
	});

	// Search Bar ---------------------------------------------------------------------------------------------------//
	const searchSubmit = async e => {
		e.preventDefault();
		navigate(`/?q=${searchTerm}`);
		dispatch({
			type: 'SEARCH',
			payload: { searchTerm },
		});
	};

	const searchChange = e => {
		setSearchTerm(e.target.value);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="navbar w-full flex gap-2 flex-col sm:flex-row bg-primary h-fit lg:h-28 text-primary-content mb-2 md:mb-8">
			{/* ------------------------------------ Navbar Start ------------------------------------ */}
			{/* Mobile Menu */}
			<div className="block lg:hidden flex-1 w-full">
				{/* Hamburger */}
				<div className="dropdown">
					<label tabIndex="0" className="btn btn-ghost btn-circle btn-sm shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
					</label>
					<ul
						tabIndex="0"
						className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52  text-neutral"
					>
						<li>
							<button onClick={() => navigate('/')}>Home</button>
						</li>
						<li>
							<button onClick={() => navigate('/categories')}>Categories</button>
						</li>
					</ul>
				</div>

				{/* Bookmarks */}
				<div className="dropdown text-neutral">
					<label
						htmlFor=""
						tabIndex="0"
						className="btn btn-sm btn-ghost btn-circle shadow-xl mx-4 cursor-pointer"
					>
						<div className="w-6 lg:w-10 rounded-full">
							<BsFillBookmarksFill
								className="text-accent h-6 w-6 lg:h-10  lg:w-10"
								title="Your Bookmarks"
							/>
						</div>
					</label>
					<ul
						className="mt-3 p-2 shadow menu dropdown-content bg-base-100 w-72 sm:w-96 rounded-box"
						tabIndex="0"
					>
						{bookmarkLoading ? (
							<Spinner />
						) : (
							bookmarks.map(bookmark => {
								return (
									<li key={bookmark.recipeId}>
										<div
											className="grid grid-cols-2 gap-2 cursor-pointer"
											onClick={() => {
												console.log(bookmark.recipeId);
												navigate(`/recipe/${bookmark.recipeId}`);
											}}
											title={bookmark.recipeName}
										>
											<p className="">{bookmark.recipeName}</p>
											<img
												src={`${bookmark.recipeImg}/preview`}
												className="object-cover h-14 sm:h-28 w-full rounded-lg cursor-pointer"
											/>
										</div>
									</li>
								);
							})
						)}
					</ul>
				</div>

				{/* User */}
				<div className="dropdown text-neutral">
					<label tabIndex="0" className="btn btn-sm btn-ghost btn-circle avatar shadow-xl">
						<div className="w-6 lg:w-10 rounded-full">
							<AiOutlineSmile className="text-accent h-6 w-6 lg:h-10 lg:w-10" />
						</div>
					</label>
					<ul
						tabIndex="0"
						className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
					>
						<li>
							<a className="justify-between">Profile</a>
						</li>
						<li>
							<a>Settings</a>
						</li>
						<li>
							<a>Logout</a>
						</li>
					</ul>
				</div>
			</div>
			{/* Full-w Menu */}
			<div className="hidden lg:block navbar-start">
				<ul tabIndex="0" className="menu menu-horizontal p-0 text-base-100">
					<li>
						<button onClick={() => navigate('/')} className="font-black hover:shadow-lg text-2xl">
							Home
						</button>
					</li>

					{/* -------------------------- Categories ------------------------------- */}
					<li tabIndex="0">
						<label
							tabIndex={0}
							className="font-black cursor-pointer text-2xl"
							onClick={() => navigate('/categories')}
						>
							Categories
						</label>
						<ul
							className="menu p-2 shadow-xl bg-base-100 w-96 h-screen max-h-120 max-h-lg rounded-box text-neutral overflow-auto"
							tabIndex="0"
						>
							{categoriesLoading ? (
								<Spinner />
							) : (
								categories.map((category, i) => {
									return (
										<li key={i}>
											<div
												className="grid grid-cols-2 gap-2 cursor-pointer"
												onClick={() => {
													navigate(`/category/${category.strCategory}`);
												}}
												title={category.strCategory}
											>
												<p className="">{category.strCategory}</p>
												<img
													src={`${category.strCategoryThumb}`}
													className="object-cover h-28 w-full rounded-lg cursor-pointer"
												/>
											</div>
										</li>
									);
								})
							)}
						</ul>
					</li>
				</ul>
			</div>

			{/* ------------------------------------ Navbar Logo ------------------------------------ */}
			<div className="hidden lg:block navbar-center">
				<button className="btn btn-lg btn-ghost shadow-xl" onClick={() => navigate('/')}>
					<RiCake3Line className="h-12 w-12" />
				</button>
			</div>

			{/* ------------------------------------ Navbar End ------------------------------------ */}
			<div className="navbar-center ml-4 w-full sm:w-fit flex-col sm:flex-row lg:navbar-end">
				{/* Search Bar */}
				<form className="form-control mr-4 w-full sm:w-80" onSubmit={searchSubmit}>
					<input
						type="text"
						placeholder="Search"
						className="input input-sm lg:input-md bg-secondary w-full text-neutral shadow-xl"
						defaultValue={searchTerm}
						onChange={searchChange}
					/>
				</form>

				<div className="hidden lg:block">
					{/* Bookmarks */}
					<div className="dropdown dropdown-end text-neutral">
						<label
							htmlFor=""
							tabIndex="0"
							className="btn btn-ghost btn-circle shadow-xl mx-4 cursor-pointer"
						>
							<div className="w-6 lg:w-10 rounded-full">
								<BsFillBookmarksFill
									className="text-accent h-6 w-6 lg:h-10  lg:w-10"
									title="Your Bookmarks"
								/>
							</div>
						</label>
						<ul className="mt-3 p-2 shadow menu dropdown-content bg-base-100 w-96 rounded-box" tabIndex="0">
							{bookmarkLoading ? (
								<Spinner />
							) : (
								bookmarks.map(bookmark => {
									return (
										<li key={bookmark.recipeId}>
											<div
												className="grid grid-cols-2 gap-2 cursor-pointer"
												onClick={() => {
													console.log(bookmark.recipeId);
													navigate(`/recipe/${bookmark.recipeId}`);
												}}
												title={bookmark.recipeName}
											>
												<p className="">{bookmark.recipeName}</p>
												<img
													src={`${bookmark.recipeImg}/preview`}
													className="object-cover h-28 w-full rounded-lg cursor-pointer"
												/>
											</div>
										</li>
									);
								})
							)}
						</ul>
					</div>

					{/* User */}
					<div className="dropdown dropdown-end text-neutral">
						<label tabIndex="0" className="btn btn-ghost btn-circle avatar shadow-xl">
							<div className="w-6 lg:w-10 rounded-full">
								<AiOutlineSmile className="text-accent h-6 w-6 lg:h-10 lg:w-10" />
							</div>
						</label>
						<ul
							tabIndex="0"
							className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
						>
							<li>
								<a className="justify-between">Profile</a>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<li>
								<a>Logout</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
