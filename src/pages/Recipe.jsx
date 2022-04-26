import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { MdAvTimer } from 'react-icons/md';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { BsCheckCircleFill, BsBookmark, BsFillBookmarkHeartFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Recipe() {
	const navigate = useNavigate();
	const params = useParams();
	const [recipe, setRecipe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [ingredients, setIngredients] = useState([]);
	const [instructions, setInstructions] = useState([]);
	const [bookmarks, setBookmarks] = useState(() => {
		const bookmarksStorage = JSON.parse(localStorage.getItem('bookmarks'));
		if (bookmarksStorage === null) {
			return [];
		} else {
			return bookmarksStorage;
		}
	});

	// Load Recipe ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`);
				const data = await response.json();

				// get the ingredients & their amounts
				const ingredientsArr = Object.entries(data.meals[0]).filter(item => item[0].includes('Ingredient'));
				const amountsArr = Object.entries(data.meals[0]).filter(item => item[0].includes('Measure'));
				ingredientsArr.forEach((ing, i) => ing.push(amountsArr[i][1]));
				const newIngredientsArr = ingredientsArr.filter(ing => ing[1] !== '').filter(ing => ing[1] !== null);

				// get the instructions
				const instructionsArr = data.meals[0].strInstructions.split('.');
				const newInstructionsArr = instructionsArr.filter(inst => inst !== '');

				setInstructions(newInstructionsArr);
				setIngredients(newIngredientsArr);
				setRecipe(data.meals[0]);
				setLoading(false);
			} catch (error) {
				toast.error(`There was an error loading this recipe.`);
			}
		};

		fetchRecipe();
	}, [navigate, params.id]);

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
		<div className="w-full max-w-screen-lg bg-base-100 mx-auto p-10 shadow-xl">
			<header className="mb-12 shadow-xl rounded-lg">
				<p className=" p-4 text-4xl font-black tracking-wider">
					RECIPEFEED{' '}
					<span className="text-lg font-light text-primary ">
						Your place for the best recipe around the world
					</span>{' '}
				</p>
			</header>
			{loading ? (
				<Spinner />
			) : (
				<div className="w-full">
					<img src={`${recipe.strMealThumb}`} className="object-cover h-96 w-full rounded-lg shadow-lg" />
					<p className="text-3xl my-5 font-black text-center w-full">{recipe.strMeal}</p>
					<div className="flex justify-between">
						<div className="flex gap-2">
							<span className="badge p-4 badge-lg cursor-pointer">{recipe.strCategory}</span>
							<span className="badge p-4 badge-primary badge-lg cursor-pointer">{recipe.strArea}</span>
							{recipe.strTags === null ? (
								''
							) : (
								<span className="badge p-4 badge-secondary badge-lg cursor-pointer">
									{recipe.strTags}
								</span>
							)}
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
								onClick={e => addToBookmarks(recipe.idMeal, recipe.strMealThumb, recipe.strMeal)}
							/>
						)}
					</div>

					{/* ------------------------- Ingregients ---------------------------- */}
					<div className="mt-6 w-full">
						<div className="divider mb-4"></div>
						<p className="font-bold text-2xl mb-4">Ingredients</p>
						{ingredients.map((ing, i) => {
							return (
								<div key={i} className="flex flex-row gap-6">
									<input type="checkbox" className="checkbox checkbox-primary" />
									<p className="mb-5 ">
										{ing[2]} {ing[1]}
									</p>
								</div>
							);
						})}
					</div>
					<div className="divider"></div>

					{/* ------------------------- Instructions ---------------------------- */}
					<div className="mt-6w-full">
						<p className="font-bold text-2xl mb-4">Instructions</p>
						{instructions.map((instruction, i) => {
							return (
								<div className="mb-10" key={i}>
									<p className="flex flex-row gap-3 font-bold mb-3">
										<BsCheckCircleFill className="text-primary" /> Step {i + 1}
									</p>
									<p className="mb-5 ml-10">{instruction}</p>
								</div>
							);
						})}
					</div>
					<div className="divider"></div>
				</div>
			)}
		</div>
	);
}

export default Recipe;
