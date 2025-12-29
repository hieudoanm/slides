import { FC } from 'react';

export const Navbar: FC = () => {
	return (
		<div className="navbar bg-base-100 border-base-300 border-b px-6">
			<div className="flex-1">
				<span className="text-lg font-bold">Pitch Deck Generator</span>
			</div>
		</div>
	);
};
