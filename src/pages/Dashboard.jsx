import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ImArrowUp } from 'react-icons/im';
import { BsBookmark, BsFillBookmarkHeartFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import SearchContext from '../context/search/SearchContext';
import CategoriesContext from '../context/categories/CategoriesContext';

function Dashboard() {
	// Context that stores the users search term
	const { searchTerm } = useContext(SearchContext);
	// Context that stores any categories that the user has selected
	const { categories, loading: loadingCats } = useContext(CategoriesContext);

	// State to store the fetched recipes
	const [recipes, setRecipes] = useState([]);
	// loading state
	const [loading, setLoading] = useState(true);
	// State to store all of the users bookmarks. Grabs them from the local storage.
	const [bookmarks, setBookmarks] = useState(() => {
		const bookmarksStorage = JSON.parse(localStorage.getItem('bookmarks'));
		if (bookmarksStorage === null) {
			return [];
		} else {
			return bookmarksStorage;
		}
	});

	const navigate = useNavigate();

	//---------------------------------------------------------------------------------------------------//
	/**
	 * Handles fetching recipes by either search term or category name.
	 * Expects a url to theMealDb.
	 * @param {string} url
	 */
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

	// ---------------------------------------------------------------------------------------------------//
	// useEffect to grab the first 10 recipes when the page first loads.
	// Also listens for any search terms entered.
	// Listens for when the user enters any letter into the search box and instantly searches the DB for recipes.
	useEffect(() => {
		//  This function grabs the first 10 random recipes displayed to the user on page load
		const fetchRandomRecipes = async () => {
			setLoading(true);
			setRecipes([]);
			try {
				// We want to grab 10 recipes from the api, but due to the way that theMealDb handles non-paid users we have to use a for-loop to repeat the request 10 different times to grab 10 recipes.
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

		// If there is a search term, fetch all search results.
		// If no search term, then just run our random 10 recipes func
		if (searchTerm !== '') {
			fetchSearchRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
		} else if (searchTerm === '') {
			fetchRandomRecipes();
		}
	}, [searchTerm]);

	// ---------------------------------------------------------------------------------------------------//
	/**
	 * handles the user adding a new bookmark for a recipe
	 * Expects a recipe Id (recipeId), recipe image url (recipeImg), and a recipe name (recipeName)
	 * @param {string} recipeId
	 * @param {string} recipeImg
	 * @param {string} recipeName
	 */
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

	// ---------------------------------------------------------------------------------------------------//
	/**
	 * Handles the user removing a recipe bookmark.
	 * Expects a recipe ID (recipeId).
	 * @param {*} recipeId
	 */
	const removeBookmark = recipeId => {
		const bookmark = bookmarks.find(bookmark => bookmark.recipeId === recipeId);
		setBookmarks(prevState => prevState.splice(bookmark, 1));

		toast.success('Removed bookmark');
	};

	// useEffect to get the users Bookmarks ---------------------------------------------------------------------------------------------------//
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
							{/* Loop over all of the categories and create a card for the sidebar */}
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
							<div className="hero-overlay bg-opacity-50 rounded-xl"></div>
							<div className="hero-content flex-col lg:flex-row">
								<div className="text-base-100 flex flex-col gap-2 md:gap-5 w-full ">
									<h1 className="text-xl lg:text-3xl xl:text-5xl font-bold">{recipes[0].strMeal}</h1>
									{recipes[0].strInstructions ? (
										<p className="text-lg">{recipes[0].strInstructions.slice(0, 60)}...</p>
									) : (
										''
									)}
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
