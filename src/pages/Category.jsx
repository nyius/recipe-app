import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Header from '../components/Header';

function Category() {
	// Load all recipes for a specific category
	const [category, setCategory] = useState(null);
	// state for loading
	const [categoryLoading, setCategoryLoading] = useState(true);

	const navigate = useNavigate();
	const params = useParams();

	// Fetch recipes in category ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const fetchCategory = async () => {
			const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${params.category}`);
			const data = await response.json();

			setCategory(data.meals);
			setCategoryLoading(false);
		};

		fetchCategory();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full bg-base-100 mx-auto p-2 lg:p-8 shadow-xl">
			<Header />
			{categoryLoading ? (
				<Spinner />
			) : (
				<div className="my-10">
					<p className="text-3xl my-3 text-center font-black">{params.category}</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-6">
						{/* Loop over each recipe and display its card */}
						{category.map((recipe, i) => {
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
										className="object-cover h-40 lg:h-80 w-full rounded-lg cursor-pointer"
										onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
									/>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

export default Category;
