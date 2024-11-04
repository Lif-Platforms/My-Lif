'use client'
import styles from './selections.module.css';
import { useRouter } from 'nextjs-toploader/app';

export default function Selections() {

    const router = useRouter();

    return (
        <div className={styles.selections}>
            <h1>Personalization</h1>
            <div className={styles.row}>
                <div onClick={() => router.push('/settings/personalization')} className={styles.card}>
                    <img src='/main/avatar.svg' />
                    <h1>Avatar</h1>
                </div>
                <div onClick={() => router.push('/settings/personalization')} className={styles.card}>
                    <img src='/main/banner.svg' />
                    <h1>Banner</h1>
                </div>
                <div onClick={() => router.push('/settings/personalization')} className={styles.card}>
                    <img src='/main/bio.svg' />
                    <h1>Bio</h1>
                </div>
            </div>
            <h1>Security</h1>
            <div className={styles.row}>
                <div onClick={() => router.push('/settings/security')} className={styles.card}>
                    <img src='/main/security.svg' />
                    <h1>Login Info</h1>
                </div>
            </div>
        </div>
    )
}