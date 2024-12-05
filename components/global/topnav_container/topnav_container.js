'use client'
import TopNav from "../topnav/topnav";
import SideNav from "../side_nav/side_nav";
import { useState } from "react";

export default function TopnavContainer({ username }) {
    const [showSideNav, setShowSideNav] = useState(false);

    return (
        <div>
            <TopNav
                username={username}
                showSideNav={showSideNav}
                setShowSideNav={setShowSideNav}
            />
            <SideNav showSideNav={showSideNav} />
        </div>
    )
}