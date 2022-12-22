import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import useSWR from "swr";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import styles from "../../styles/Store.module.css";
import { isEmpty, fetcher } from "../../utils";

export const getStaticProps = async (staticProps) => {
	const params = staticProps.params;

	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
		return coffeeStore.id.toString() === params.id;
	});

	return {
		props: {
			coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
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
const Store = (initialProps) => {
	const { query, isFallback } = useRouter();

	const id = query.id;

	const [coffeeStore, setCoffeeStore] = useState(
		initialProps.coffeeStore || {}
	);

	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
			const response = await fetch("/api/createCoffeeStore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					voting: 0,
					imgUrl,
					neighbourhood: neighbourhood || "",
					address: address || "",
				}),
			});

			const dbCoffeeStore = await response.json();
		} catch (err) {
			console.error("Error creating coffee store", err);
		}
	};

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});

				setCoffeeStore(findCoffeeStoreById);
				handleCreateCoffeeStore(findCoffeeStoreById);
			}
		} else {
			// SSG
			handleCreateCoffeeStore(initialProps.coffeeStore);
		}

		// return () => {};
	}, [id, coffeeStores, initialProps.coffeeStore]);

	const {
		name = "",
		address = "",
		neighbourhood = "",
		imgUrl = "",
	} = coffeeStore;
	const [votingCount, setVotingCount] = useState(0);

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	useEffect(() => {
		if (data && data.length > 0) {
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);

	if (isFallback) {
		return <div>Loading...</div>;
	}

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/favouriteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (err) {
			console.error("Error upvoting the coffee store", err);
		}
	};

	if (error) {
		return <div>Something went wrong retrieving coffee store page</div>;
	}

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
						priority
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
						}
						width={600}
						height={360}
						alt={name ? name : "coffee store"}
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
					{neighbourhood && (
						<div className={styles.iconWrapper}>
							<Image
								src={"/static/icons/nearMe.svg"}
								width={24}
								height={24}
								alt="icon"
							/>
							<p className={styles.text}>{neighbourhood}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src={"/static/icons/star.svg"}
							width={24}
							height={24}
							alt="icon"
						/>
						<p className={styles.text}>{votingCount}</p>
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
