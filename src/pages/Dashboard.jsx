import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdAvTimer } from 'react-icons/md';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { BsBookmark, BsFillBookmarkHeartFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Dashboard() {
	const navigate = useNavigate();
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [bookmarks, setBookmarks] = useState(() => {
		const bookmarksStorage = JSON.parse(localStorage.getItem('bookmarks'));
		if (bookmarksStorage === null) {
			return [];
		} else {
			return bookmarksStorage;
		}
	});

	// Fetch Recipes ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				for (let i = 0; i < 10; i++) {
					const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
					const data = await response.json();

					setRecipes(prevState => [...prevState, data.meals[0]]);
					setLoading(false);
				}
			} catch (error) {
				toast.error(`There was an error loading recipes.`);
			}
		};

		fetchRecipes();
	}, []);

	// Add to Bookmarks---------------------------------------------------------------------------------------------------//
	const addToBookmarks = (recipeId, recipeImg, recipeName) => {
		setBookmarks(prevState =>
			prevState
				? [
						...prevState,
						{
							recipeId,
							recipeImg,
							recipeName,
						},
				  ]
				: [
						{
							recipeId,
							recipeImg,
							recipeName,
						},
				  ]
		);
		toast.success('Added Recipe to Bookmarks!');
	};

	// remove bookmark ---------------------------------------------------------------------------------------------------//
	const removeBookmark = recipeId => {
		const bookmark = bookmarks.find(bookmark => bookmark.recipeId === recipeId);
		setBookmarks(prevState => prevState.splice(bookmark, 1));

		toast.success('Removed bookmark');
	};

	// Set Bookmarks ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		if (bookmarks !== JSON.parse(localStorage.getItem('bookmarks'))) {
			localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

			// Create a new window event for our navbar to listen to (for pulling bookmarks)
			window.dispatchEvent(new Event('storage'));
		}
	}, [bookmarks]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full bg-base-100 mx-auto p-8 shadow-xl">
			<header className="mb-6 shadow-xl rounded-lg">
				<p className=" p-4 text-4xl font-black tracking-wider">
					RECIPEFEED{' '}
					<span className="text-lg font-light text-primary ">
						Your place for the best recipes around the world
					</span>{' '}
				</p>
			</header>
			{loading ? (
				<Spinner />
			) : (
				<div className="grid grid-cols-4 gap-6">
					{recipes.map((recipe, i) => {
						return (
							<div key={i} className={`w-full h-96 p-4 rounded-lg shadow-lg hover:bg-accent`}>
								<p className="font-bold text-xl mb-2 truncate cursor-pointer" title={recipe.strMeal}>
									{recipe.strMeal}
								</p>
								<img
									src={`${recipe.strMealThumb}`}
									className="object-cover h-60 w-full rounded-lg cursor-pointer"
									onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
								/>
								<div className="flex my-4 gap-2 justify-between">
									<span className="badge cursor-pointer">{recipe.strCategory}</span>
									<span className="badge badge-primary cursor-pointer">{recipe.strArea}</span>
									<p className="w-full text-right font-light">
										Recipe by: <a href={`${recipe.strSource}`}>Source</a>
									</p>
								</div>
								<div className="flex flex-row items-center justify-between">
									<div className="flex flex-row items-center">
										<ImArrowUp className="text-info hover:text-primary w-5 h-5 mr-2 cursor-pointer" />
										<p className="mr-4">4782</p>
										<ImArrowDown className="text-info hover:text-error w-5 h-5 mr-2 cursor-pointer" />
										<p className="mr-4">29</p>
									</div>

									{/* ------------------- Bookmark Icon ----------------------- */}
									{bookmarks.find(bookmark => bookmark.recipeId === recipe.idMeal) ? (
										<BsFillBookmarkHeartFill
											className="h-6 w-6 cursor-pointer"
											title="Add to Bookmarks"
											id={recipe.idMeal}
											onClick={e => removeBookmark(recipe.idMeal)}
										/>
									) : (
										<BsBookmark
											className="h-6 w-6 cursor-pointer"
											title="Add to Bookmarks"
											id={recipe.idMeal}
											onClick={e =>
												addToBookmarks(recipe.idMeal, recipe.strMealThumb, recipe.strMeal)
											}
										/>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default Dashboard;
