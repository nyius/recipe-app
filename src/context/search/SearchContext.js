import React, { useState, useReducer, createContext, useEffect } from 'react';
import SearchReducer from './SearchReducer';

const SearchContext = createContext();

/**
 * Provides the context for a user entering a search term
 * @param {*} param0
 * @returns
 */
export function SearchProvider({ children }) {
	const initialState = {
		searchTerm: '',
	};

	const [state, dispatch] = useReducer(SearchReducer, initialState);

	return <SearchContext.Provider value={{ ...state, dispatch }}>{children}</SearchContext.Provider>;
}

export default SearchContext;
