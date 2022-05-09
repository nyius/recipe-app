import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

function Categories() {
	// State to store all of the categories
	const [categories, setCategories] = useState(null);
	// Loading state
	const [categoriesLoading, setCategoriesLoading] = useState(true);

	const navigate = useNavigate();

	// useEffect to handle Getting the Categories from the Api ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
				const data = await response.json();

				setCategories(data.categories);
				setCategoriesLoading(false);
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong. Please try again');
			}
		};

		getCategories();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full bg-base-100 mx-auto p-2 lg:p-8 shadow-xl">
			<Header />
			{categoriesLoading ? (
				<Spinner />
			) : (
				<div className="my-10">
					<p className="text-3xl my-3 text-center font-black">Categories</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-6">
						{/* Loop over each category and display its card */}
						{categories.map((category, i) => {
							return (
								<div
									key={i}
									className={`w-full h-fit p-4 rounded-lg shadow-lg hover:bg-accent cursor-pointer`}
									onClick={() => {
										navigate(`/category/${category.strCategory}`);
									}}
								>
									<p className="font-bold text-xl mb-2 truncate" title={category.strCategory}>
										{category.strCategory}
									</p>
									<img
										src={`${category.strCategoryThumb}`}
										className="object-cover h-40 lg:h-80 w-full rounded-lg cursor-pointer"
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

export default Categories;
