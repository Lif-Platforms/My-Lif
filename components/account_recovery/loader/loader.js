'use client'

import styles from './loader.module.css';

export default function Loader({ isLoading }) {
    if (isLoading) {
        return (
            <span className={styles.loader} />
        )
    }
}