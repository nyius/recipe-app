import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCake3Line } from 'react-icons/ri';
import { AiOutlineSmile } from 'react-icons/ai';
import { BsFillBookmarksFill } from 'react-icons/bs';
import Spinner from './Spinner';

function Navbar() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [bookmarks, setBookmarks] = useState(null);

	useEffect(() => {
		setBookmarks(() => {
			console.log(JSON.parse(localStorage.getItem('bookmarks')));
			return JSON.parse(localStorage.getItem('bookmarks'));
		});
		setLoading(false);
	}, []);

	const searchSubmit = async e => {
		e.preventDefault();
	};

	return (
		<div className="navbar bg-primary h-28 text-primary-content mb-8">
			<div className="block lg:hidden navbar-start">
				<div className="dropdown">
					<label tabIndex="0" className="btn btn-ghost btn-circle btn-lg shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-10"
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
							<button>Categories</button>
						</li>
						<li>
							<button>About</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="hidden lg:block navbar-start">
				<ul tabIndex="0" className=" menu menu-horizontal p-0 text-2xl text-base-100">
					<li>
						<button onClick={() => navigate('/')} className="font-black hover:shadow-lg">
							Home
						</button>
					</li>
					<li>
						<button className="font-black hover:shadow-lg">Categories</button>
					</li>
					<li>
						<button className="font-black hover:shadow-lg">About</button>
					</li>
				</ul>
			</div>
			<div className="navbar-center">
				<button className="btn btn-lg btn-ghost shadow-xl" onClick={() => navigate('/')}>
					<RiCake3Line className="h-12 w-12" />
				</button>
			</div>
			<div className="navbar-end">
				{/* Search Bar */}
				<form className="form-control mr-4" onSubmit={searchSubmit}>
					<input
						type="text"
						placeholder="Search"
						className="input bg-secondary w-full text-neutral shadow-xl"
					/>
				</form>

				{/* Bookmarks */}
				<div className="dropdown dropdown-end text-neutral">
					<label htmlFor="" tabIndex="0" className="btn btn-ghost btn-circle shadow-xl mx-4 cursor-pointer">
						<BsFillBookmarksFill className="text-accent h-10 w-10" title="Your Bookmarks" />
					</label>
					<ul className="mt-3 p-2 shadow menu dropdown-content bg-base-100 w-96 rounded-box" tabIndex="0">
						{loading ? (
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
												src={`${bookmark.recipeImg}`}
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
						<div className="w-10 rounded-full">
							<AiOutlineSmile className="text-accent h-10 w-10" />
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
	);
}

export default Navbar;
