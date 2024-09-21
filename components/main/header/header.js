'use client'
import styles from './header.module.css';

export default function Header({ username, pronouns, bio }) {

    return (
        <div className={styles.header}>
            <img className={styles.user_banner} src={`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_banner/${username}.png`} />
            <div className={styles.user_info}>
                <img className={styles.user_avatar} src={`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_avatar/${username}.png`} />
                <div>
                    <h1>{username}</h1>
                    <p>Pronouns: {(pronouns)}</p>
                    <p>Bio: {bio}</p>
                </div>
            </div>
        </div>
    )
}