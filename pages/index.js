import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import Card from "../components/Card";
import { fetchCoffeeStores } from "../lib/coffee-stores";

export const getStaticProps = async (context) => {
	const coffeeStores = await fetchCoffeeStores();

	return {
		props: {
			coffeeStores,
		},
	};
};

export default function Home(props) {
	const handleBannerOnClick = () => {};

	return (
		<div className={styles.container}>
			<Head>
				<title>Local Coffees</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<div className={styles.top}>
					<Banner
						buttonText="View stores nearby"
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
				{props.coffeeStores.length > 0 && (
					<>
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
					</>
				)}
			</main>
		</div>
	);
}
