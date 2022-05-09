import React from 'react';

function Header() {
	// A basic header
	return (
		<header className="mb-3 lg:mb-6 shadow-xl rounded-lg">
			<p className=" p-4 text-xl lg:text-4xl font-black tracking-wider">
				RECIPEFEED{' '}
				<span className="text-sm lg:text-lg font-light text-primary ">
					Your place for the best recipes around the world
				</span>{' '}
			</p>
		</header>
	);
}

export default Header;
