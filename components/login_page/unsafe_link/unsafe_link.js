import styles from './unsafe_link.module.css'

export default function UnsafeLink() {
    return (
        <div className={styles.unsafe_link}>
            <img src='/login/stop.png' />
            <h1>Untrusted Link</h1>
            <p>The link you provided does not redirect to lifplatforms.com or any Lif Platforms sub-domains. Please ensure your link is from a trusted source.</p>
        </div>
    )
}