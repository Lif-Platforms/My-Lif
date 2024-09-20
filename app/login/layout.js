import styles from './page.module.css';

export default function LoginLayout({ children }) {
    return (
        <div className={styles.login_page}>
            {children}
        </div>
    )
}