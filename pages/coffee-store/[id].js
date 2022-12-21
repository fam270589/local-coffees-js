import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import styles from "../../styles/Store.module.css";

export const getStaticProps = async (staticProps) => {
	const params = staticProps.params;

	const coffeeStores = await fetchCoffeeStores();

	return {
		props: {
			coffeeStore: coffeeStores.find((coffeeStore) => {
				return coffeeStore.id.toString() === params.id;
			}),
		},
	};
};

export const getStaticPaths = async () => {
	const coffeeStores = await fetchCoffeeStores();

	const paths = coffeeStores.map((coffeeStore) => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		};
	});

	return {
		paths,
		fallback: true,
	};
};

//todo:-----Store component-----://
const Store = (props) => {
	const { query, isFallback } = useRouter();

	if (isFallback) return <div>Loading...</div>;

	const { address, name, imgUrl, neighborhood } = props.coffeeStore;

	const handleUpvoteButton = () => {};

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>

			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href="/" className="">
							&larr; Back to home
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<p className={styles.name}>{name}</p>
					</div>
					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
						}
						width={600}
						height={360}
						alt={name}
						className={styles.storeImg}
					/>
				</div>
				<div className={styles.col2}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image
								src={"/static/icons/places.svg"}
								width={24}
								height={24}
								alt="icon"
							/>
							<p className={styles.text}>{address}</p>
						</div>
					)}
					{neighborhood && (
						<div className={styles.iconWrapper}>
							<Image
								src={"/static/icons/nearMe.svg"}
								width={24}
								height={24}
								alt="icon"
							/>
							<p className={styles.text}>{neighborhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src={"/static/icons/star.svg"}
							width={24}
							height={24}
							alt="icon"
						/>
						<p className={styles.text}>1</p>
					</div>

					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>
						Up vote!
					</button>
				</div>
			</div>
		</div>
	);
};

export default Store;
