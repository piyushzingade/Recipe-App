import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { getRandomColor } from "../lib/utils";

const APP_ID = import.meta.env.VITE_APP_ID || "eb2cc34c";
const APP_KEY = import.meta.env.VITE_APP_KEY || "51e852fb5682fe4d5a0c3dd9cf77b08c";

const HomePage = () => {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchRecipes = async (searchQuery) => {
		if (!searchQuery) return; // Prevent API call if search query is empty
		setLoading(true);
		setRecipes([]);
		setError(null);
		try {
			const res = await fetch(
				`https://api.edamam.com/api/recipes/v2/?app_id=${APP_ID}&app_key=${APP_KEY}&q=${searchQuery}&type=public`
			);
			const data = await res.json();
			setRecipes(data.hits || []);
		} catch (error) {
			setError("Failed to fetch recipes. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecipes("chicken"); // Preload with "chicken" recipes or remove this line to avoid default fetch
	}, []);

	const handleSearchRecipe = (e) => {
		e.preventDefault();
		const searchQuery = e.target[0].value.trim();
		if (searchQuery) {
			fetchRecipes(searchQuery);
		} else {
			setError("Please enter a search term.");
		}
	};

	return (
		<div className='bg-[#faf9fb] p-10 flex-1'>
			<div className='max-w-screen-lg mx-auto'>
				<form onSubmit={handleSearchRecipe}>
					<label className='input shadow-md flex items-center gap-2'>
						<Search size={"24"} />
						<input
							type='text'
							className='text-sm md:text-md grow'
							placeholder='What do you want to cook today?'
						/>
					</label>
				</form>

				<h1 className='font-bold text-3xl md:text-5xl mt-4'>Recommended Recipes</h1>
				<p className='text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight'>
					Popular choices
				</p>

				{error && <p className='text-red-500'>{error}</p>}

				<div className='grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
					{!loading &&
						recipes.map(({ recipe }, index) => (
							<RecipeCard key={index} recipe={recipe} {...getRandomColor()} />
						))}

					{loading &&
						[...Array(9)].map((_, index) => (
							<div key={index} className='flex flex-col gap-4 w-full'>
								<div className='skeleton h-32 w-full rounded-md'></div>
								<div className='flex justify-between'>
									<div className='skeleton h-4 w-28 rounded-md'></div>
									<div className='skeleton h-4 w-24 rounded-md'></div>
								</div>
								<div className='skeleton h-4 w-1/2 rounded-md'></div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
