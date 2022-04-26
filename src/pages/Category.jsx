import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Header from '../components/Header';

function Category() {
	const navigate = useNavigate();
	const params = useParams();
	const [category, setCategory] = useState(null);
	const [categoryLoading, setCategoryLoading] = useState(true);

	useEffect(() => {
		const fetchCategory = async () => {
			const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${params.category}`);
			const data = await response.json();

			setCategory(data.meals);
		};

		fetchCategory();
		setCategoryLoading(false);
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full max-w-screen-lg bg-base-100 mx-auto p-10 shadow-xl">
			<Header />
			{categoryLoading ? (
				<Spinner />
			) : (
				<div className="grid grid-cols-4 gap-6">
					{category.map((recipe, i) => {
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
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default Category;
