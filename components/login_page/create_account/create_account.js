'use client'
import styles from './create_account.module.css';
import Link from 'next/link';

export default function CreateAccount() {
    return (
        <div className={styles.create_account}>
            <p>Don't have an account? <Link href="/create_account">Create One</Link>.</p>
        </div>
    )
}