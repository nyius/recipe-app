function CategoriesReducer(state, action) {
	switch (action.type) {
		case 'GET_CATEGORIES':
			return {
				...state,
				categories: action.payload,
			};
	}
}

export default CategoriesReducer;
