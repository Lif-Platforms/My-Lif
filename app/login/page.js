import { cookies } from 'next/headers';
import LoginForm from '@/components/login_page/login_form/login_form';
import CreateAccount from '@/components/login_page/create_account/create_account';

export default async function LoginPage() {
    const cookie_store = cookies();

    // Get username and token cookies
    const username_cookie = cookie_store.get('LIF_USERNAME');
    const token_cookie = cookie_store.get("LIF_TOKEN");

    // Check if username and token cookies exist
    if (username_cookie && token_cookie) {
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
            return <h1>Logged in</h1>;
        } else {
            return (
                <div>
                    <LoginForm />
                    <CreateAccount />
                </div>
            )
        }
    } else {
        return (
            <div>
                <LoginForm />
                <CreateAccount />
            </div>
        )
    }
}