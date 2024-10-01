import styles from "./tile.module.css";

export default function Tile({ title, description, component }) {
    return (
        <div className={styles.tile}>
            <div className={styles.header}>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <div className={styles.content}>
                {component}
            </div> 
        </div>
    );
}