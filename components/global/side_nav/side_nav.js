import styles from './side_nav.module.css';
import Link from 'next/link';

export default function SideNav({ showSideNav }) {
    if (showSideNav) {
        return (
            <div className={styles.side_nav}>
                <Link href="/settings/personalization">Personalization</Link>
                <Link href="/settings/security">Security</Link>
            </div>
        )
    }
}