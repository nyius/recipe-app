import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';

function Category() {
	const navigate = useNavigate();
	const params = useParams();
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategory = async () => {
			const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${params.category}`);
			const data = await response.json();

			setCategory(data.meals);
		};

		fetchCategory();
		setLoading(false);
	}, []);

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
