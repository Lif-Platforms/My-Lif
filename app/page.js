import TopNav from "@/components/global/topnav/topnav";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import Header from "@/components/main/header/header";
import Selections from "@/components/main/selections/selections";
import { redirect } from "next/navigation";
import TopnavContainer from "@/components/global/topnav_container/topnav_container";

export default async function Home() {
  const cookie_store = cookies();
  const username_cookie = cookie_store.get('LIF_USERNAME');
  const token_cookie = cookie_store.get('LIF_TOKEN');

  if (!username_cookie && !token_cookie) {
    return redirect('/login');
  }

  // Create form data for auth request
  const formData = new FormData();
  formData.append('username', username_cookie.value);
  formData.append('token', token_cookie.value);

  // Verify user is logged in
  const auth_response = await fetch(`${process.env.AUTH_URL}/auth/verify_token`, {
    method: 'POST',
    body: formData
  });

  if (!auth_response.ok) {
    return redirect('/login');
  }

  let pronouns;
  let bio;

  // Fetch profile info
  const response = await fetch(`${process.env.AUTH_URL}/profile/get_pronouns/${username_cookie.value}`);

  if (response.ok) {
    pronouns = await response.text();
    pronouns = pronouns.replace(/^"|"$/g, '');
  } else {
    pronouns = "Failed To Load!";
  }

  const response2 = await fetch(`${process.env.AUTH_URL}/profile/get_bio/${username_cookie.value}`);

  if (response2.ok) {
    bio = await response2.text();
    bio = bio.replace(/^"|"$/g, '');
  } else {
    bio = "Failed to load!";
  }

  return (
    <div className={styles.page}>
      <TopnavContainer username={username_cookie.value} />
      <div className={styles.content}>
        <Header
          username={username_cookie.value}
          pronouns={pronouns}
          bio={bio}
        />
        <Selections />
      </div>
    </div>
  );
}
