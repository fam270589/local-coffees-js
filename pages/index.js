import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import Card from "../components/Card";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export const getStaticProps = async (context) => {
	if (
		!process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY &&
		!process.env.AIRTABLE_API_KEY &&
		!process.env.AIRTABLE_BASE_KEY &&
		!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
	) {
		return {
			redirect: {
				destination: "/problem",
				permanent: false,
			},
		};
	}
	const coffeeStores = await fetchCoffeeStores();

	return {
		props: {
			coffeeStores,
		},
	};
};

export default function Home(props) {
	// const [coffeeStores, setCoffeeStores] = useState([]);
	const [coffeeStoresError, setcoffeeStoresError] = useState(null);
	const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
		useTrackLocation();

	const { dispatch, state } = useContext(StoreContext);
	const { coffeeStores, latLong } = state;

	useEffect(() => {
		async function setCoffeeStoresByLocation() {
			if (latLong) {
				try {
					const response = await fetch(
						`/api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`
					);

					const coffeeStores = await response.json();

					// setCoffeeStores(fetchedCoffeeStores);
					dispatch({
						type: ACTION_TYPES.SET_COFFEE_STORES,
						payload: {
							coffeeStores,
						},
					});
					setcoffeeStoresError("");
				} catch (error) {
					console.log({ error });
					setcoffeeStoresError(error.message);
				}
			}
		}

		setCoffeeStoresByLocation();

		// return () => {}; // cleanup
	}, [latLong, dispatch]);

	const handleBannerOnClick = () => {
		handleTrackLocation();
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Local Coffees</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<div className={styles.top}>
					<Banner
						buttonText={
							isFindingLocation ? "Locating..." : "View stores nearby"
						}
						onClick={handleBannerOnClick}
					/>
					<div className={styles.heroImage}>
						<Image
							priority
							className={styles.image}
							src={"/static/hero.png"}
							alt="coffee"
							width={500}
							height={500}
						/>
					</div>
				</div>
				{locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
				{coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
				{coffeeStores.length > 0 && (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>Stores near me</h2>
						<div className={styles.cardLayout}>
							{coffeeStores.map((store) => (
								<Card
									key={store.id}
									name={store.name}
									image={
										store.imgUrl ||
										"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
									}
									href={`/coffee-store/${store.id}`}
								/>
							))}
						</div>
					</div>
				)}
				{props.coffeeStores.length > 0 && (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>Yogyakarta stores</h2>
						<div className={styles.cardLayout}>
							{props.coffeeStores.map((store) => (
								<Card
									key={store.id}
									name={store.name}
									image={
										store.imgUrl ||
										"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
									}
									href={`/coffee-store/${store.id}`}
								/>
							))}
						</div>
					</div>
				)}
			</main>

			<footer className={styles.footer}>fam @ 2022</footer>
		</div>
	);
}
