const SearchReducer = (state, action) => {
	switch (action.type) {
		case 'SEARCH':
			return {
				...state,
				searchTerm: action.payload.searchTerm,
			};
	}
};

export default SearchReducer;
