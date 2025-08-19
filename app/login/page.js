import { cookies } from 'next/headers';
import LoginForm from '@/components/login_page/login_form/login_form';
import CreateAccount from '@/components/login_page/create_account/create_account';
import UnsafeLink from '@/components/login_page/unsafe_link/unsafe_link';
import ContinueAs from '@/components/login_page/continue_as/continue_as';

export const metadata = {
    title: "Login To Your Lif Account",
    description: "Log into Lif Platforms with your Lif Account"
}

export default async function LoginPage({ searchParams }) {
    const cookie_store = cookies();

    // Get username and token cookies
    const username_cookie = cookie_store.get('LIF_USERNAME');
    const token_cookie = cookie_store.get("LIF_TOKEN");

    // Get redirect URL if present
    const query_params = searchParams;
    const redirect_url = query_params.redirect;

    if (redirect_url) {
        // Check to ensure link redirects to a lif platforms domain
        const parsedUrl = new URL(redirect_url);
        const tld = parsedUrl.hostname.split('.').slice(-2).join('.'); 

        if (tld !== "lifplatforms.com") {
            return <UnsafeLink />;
        }
    }

    if (!username_cookie || !token_cookie) { return (
        <div>
            <LoginForm redirect_url={redirect_url} />
            <CreateAccount />
        </div>
    )}

    // Create form data for auth request
    const formData = new FormData();
    formData.append('username', username_cookie.value);
    formData.append('token', token_cookie.value);

    // Authenticate with auth server
    const auth_response = await fetch(`${process.env.AUTH_URL}/auth/verify_token`, {
        method: "POST",
        body: formData
    });

    if (auth_response.ok) {
        return <ContinueAs redirect_url={redirect_url} username={username_cookie.value} />;
    } else {
        return (
            <div>
                <LoginForm redirect_url={redirect_url} />
                <CreateAccount />
            </div>
        )
    }
}