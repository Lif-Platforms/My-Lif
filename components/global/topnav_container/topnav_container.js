'use client'
import TopNav from "../topnav/topnav";
import SideNav from "../side_nav/side_nav";
import { useState } from "react";
import styles from "./topnav_container.module.css";

export default function TopnavContainer({ username }) {
    const [showSideNav, setShowSideNav] = useState(false);

    return (
        <div className={styles.container}>
            <TopNav
                username={username}
                showSideNav={showSideNav}
                setShowSideNav={setShowSideNav}
            />
            <SideNav showSideNav={showSideNav} />
        </div>
    )
}