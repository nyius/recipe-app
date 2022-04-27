import React, { useState, useReducer, createContext, useEffect } from 'react';
import CategoriesReducer from './CategoriesReducer';

const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
	const [loading, setLoading] = useState(true);
	const initialState = {
		categories: [],
	};

	// Get Categories ---------------------------------------------------------------------------------------------------//
	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
				const data = await response.json().then(data => {
					dispatch({
						type: 'GET_CATEGORIES',
						payload: data.categories,
					});
					setLoading(false);
				});
			} catch (error) {
				console.log(error);
			}
		};

		getCategories();
	}, []);

	const [state, dispatch] = useReducer(CategoriesReducer, initialState);

	return <CategoriesContext.Provider value={{ ...state, loading, dispatch }}>{children}</CategoriesContext.Provider>;
}

export default CategoriesContext;
