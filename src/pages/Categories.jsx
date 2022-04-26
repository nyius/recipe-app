import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

function Categories() {
	const navigate = useNavigate();
	const [categories, setCategories] = useState(null);
	const [categoriesLoading, setCategoriesLoading] = useState(true);

	// Get Categories ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
				const data = await response.json();

				setCategories(data.categories);
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong. Please try again');
			}
		};

		getCategories();
		setCategoriesLoading(false);
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full bg-base-100 mx-auto p-8 shadow-xl">
			<Header />
			{categoriesLoading ? (
				<Spinner />
			) : (
				<div className="my-10">
					<p className="text-3xl my-3 text-center font-black">Categories</p>
					<div className="grid grid-cols-4 gap-6">
						{categories.map((category, i) => {
							return (
								<div
									key={i}
									className={`w-full h-80 p-4 rounded-lg shadow-lg hover:bg-accent cursor-pointer`}
									onClick={() => {
										navigate(`/category/${category.strCategory}`);
									}}
								>
									<p className="font-bold text-xl mb-2 truncate" title={category.strCategory}>
										{category.strCategory}
									</p>
									<img
										src={`${category.strCategoryThumb}`}
										className="object-cover h-60 w-full rounded-lg"
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
