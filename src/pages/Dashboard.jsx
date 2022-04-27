import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { BsBookmark, BsFillBookmarkHeartFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import queryString from 'query-string';
import SearchContext from '../context/search/SearchContext';
import CategoriesContext from '../context/categories/CategoriesContext';

function Dashboard() {
	const location = useLocation();
	const navigate = useNavigate();
	const { searchTerm } = useContext(SearchContext);
	const { categories, loading: loadingCats } = useContext(CategoriesContext);
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

	const fetchSearchRecipes = async url => {
		setLoading(true);
		setRecipes([]);
		try {
			const response = await fetch(url);
			const data = await response.json();

			setRecipes(data.meals);
			setLoading(false);
		} catch (error) {
			toast.error('There was a problem searching.');
		}
	};

	// Fetch Recipes ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const fetchRandomRecipes = async () => {
			setLoading(true);

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

		fetchRandomRecipes();
	}, []);

	// Get search Term---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const fetchRandomRecipes = async () => {
			setLoading(true);
			setRecipes([]);
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

		if (searchTerm !== '') {
			fetchSearchRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
		} else if (searchTerm === '') {
			fetchRandomRecipes();
		}
	}, [searchTerm]);

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

	//------------------------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full bg-base-100 mx-auto p-2 lg:p-8 shadow-xl">
			<Header />
			<div className="grid grid-cols-12 gap-2">
				<div className="hidden xl:block col-span-2 mr-4 mt-3 shadow-xl p-4 rounded-lg">
					<p className="text-xl font-bold">Categories</p>
					<div className="divider" />
					{loadingCats ? (
						<Spinner />
					) : (
						<div>
							{categories.map((category, i) => {
								return (
									<p
										className="text-xl mb-3 p-2 cursor-pointer hover:bg-accent rounded-lg"
										onClick={() => {
											navigate('/');
											fetchSearchRecipes(
												`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`
											);
										}}
										key={i}
									>
										{category.strCategory}
									</p>
								);
							})}
						</div>
					)}
				</div>
				{loading ? (
					<Spinner />
				) : (
					<div className="col-span-12 xl:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-6">
						{/* ------------------------- Hero Image ------------------------ */}
						<div
							className="hero bg-base-300 col-span-1 md:col-span-2 xl:col-span-4 h-fit md:h-96 rounded-xl shadow-lg overflow-hidden w-full"
							style={{ backgroundImage: `url(${recipes[0].strMealThumb})` }}
						>
							<div class="hero-overlay bg-opacity-50 rounded-xl"></div>
							<div className="hero-content flex-col lg:flex-row">
								<div className="text-base-100 flex flex-col gap-2 md:gap-5 w-full ">
									<h1 className="text-xl lg:text-3xl xl:text-5xl font-bold">{recipes[0].strMeal}</h1>
									<p className="text-lg">{recipes[0].strInstructions.slice(0, 60)}...</p>
									<div className="flex flex-row gap-3">
										{recipes[0].strCategory ? (
											<span className="badge badge-lg badge-neutral cursor-pointer p-4">
												{recipes[0].strCategory}
											</span>
										) : (
											''
										)}
										{recipes[0].strArea ? (
											<span className="badge badge-lg badge-primary cursor-pointer p-4">
												{recipes[0].strArea}
											</span>
										) : (
											''
										)}
									</div>
									<button
										className="btn btn-md w-52 btn-secondary"
										onClick={() => navigate(`/recipe/${recipes[0].idMeal}`)}
									>
										See Recipe
									</button>
								</div>
							</div>
						</div>

						{/* ------------------------- Recipes ------------------------ */}
						{recipes.map((recipe, i) => {
							return (
								<div key={i} className={`w-full h-fit p-4 rounded-lg shadow-lg hover:bg-accent`}>
									<p
										className="font-bold text-xl mb-2 truncate cursor-pointer"
										title={recipe.strMeal}
									>
										{recipe.strMeal}
									</p>
									<img
										src={`${recipe.strMealThumb}`}
										className="object-cover h-28 lg:h-60 w-full rounded-lg cursor-pointer"
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
											<p className="mr-4">{recipe.idMeal - 50000}</p>
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
		</div>
	);
}

export default Dashboard;
