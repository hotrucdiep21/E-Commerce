import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useCartStore } from "../stores/useCartStore";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	


	const { isLoading, recommendationProducts, getRecommendations } = useCartStore();

	useEffect(() => {
		getRecommendations();
		setRecommendations(recommendationProducts);
	}, []);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{recommendationProducts.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};
export default PeopleAlsoBought;