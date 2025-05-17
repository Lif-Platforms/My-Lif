import styles from './page.module.css';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SideBar from '@/components/settings_page/sidebar/sidebar';
import Tiles from '@/components/settings_page/tiles/tiles';
import TopnavContainer from '@/components/global/topnav_container/topnav_container';
import CookieBanner from '@/components/global/cookie_banner/banner';

export default async function Settings({ params }) {
    const cookie_store = cookies();
    const username_cookie = cookie_store.get("LIF_USERNAME");
    const token_cookie = cookie_store.get('LIF_TOKEN');

    if (!username_cookie && !token_cookie) {
        return redirect('/login');
    }

    // Create form data for auth request
    const formData = new FormData();
    formData.append('username', username_cookie.value);
    formData.append('token', token_cookie.value);

    // Ensure user is logged in
    const auth_request = await fetch(`${process.env.AUTH_URL}/auth/verify_token`, {
        method: "POST",
        body: formData
    });

    if (!auth_request.ok) {
        return redirect('/login');
    }

    // Format page title
    const page_title = params.page;
    const format_page_title = page_title.charAt(0).toUpperCase() + page_title.slice(1);

    return (
        <div className={styles.page}>
            <TopnavContainer username={username_cookie.value} />
            <div className={styles.page_content}>
                <SideBar page={params.page} />
                <div className={styles.content}>
                    <h1 className={styles.title}>{format_page_title}</h1>
                    <Tiles page={params.page} />
                </div>
            </div>
            <CookieBanner />
        </div>
    )
}