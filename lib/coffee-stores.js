import { createApi } from "unsplash-js";

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const latlongJogja = "-7.794666319759305%2C110.35787295098693";
const latlongToronto = "43.68467411973505,-79.4671512470564";

const getUrlForCoffeeStores = (latlong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplash.search.getPhotos({
		query: "coffee shop",
		page: 1,
		perPage: 10,
	});

	const unsplashResults = photos.response.results;

	return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async () => {
	const photos = await getListOfCoffeeStorePhotos();

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: process.env.FOURSQUARE_API_KEY,
		},
	};

	const response = await fetch(
		getUrlForCoffeeStores(latlongJogja, "coffee", 6),
		options
	);
	const data = await response.json();

	return data.results.map((result, idx) => {
		const neighborhood = result.location.neighborhood
		? result.location.neighborhood[0]
		: result.location.region;

		return {
			id: result.fsq_id,
			name: result.name,
			address: result.location.address,
			neighborhood,
			imgUrl: photos.length > 0 ? photos[idx] : null,
		};
	});

	// .catch(err => console.error(err));
};
