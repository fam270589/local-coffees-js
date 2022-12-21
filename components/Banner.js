import styles from "./Banner.module.css";

//todo:-----Banner component-----://
const Banner = (props) => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<span className={styles.title1}>Local</span>
				<span className={styles.title2}>Coffees</span>
			</h1>
			<p className={styles.subTitle}>Discover your local cofee shops!</p>
			<button onClick={props.onClick} className={styles.button}>
				{props.buttonText}
			</button>
		</div>
	);
};

export default Banner;
