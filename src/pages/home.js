import { get_username } from "../scripts/get_cookie";
import "../css/dashboard.css";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import More from "../assets/dashboard/more.png";

// Asset Import
import Avatar from "../assets/dashboard/avatar.svg";
import Banner from '../assets/dashboard/banner.svg';
import Bio from "../assets/dashboard/bio.svg";
import Security_Icon from "../assets/dashboard/security.svg";

function MoreMenu({ menuOpen }) {

    function handle_logout() {
        window.location.href = `${process.env.REACT_APP_AUTH_URL}/auth/logout?redirect=https://my.lifplatforms.com/login`;
    }

    if (menuOpen) {
        return(
            <div className="more-menu">
                <button onClick={() => handle_logout()}>Log Out</button>
            </div>
        );
    } 
}

function Header() {
    const [openMenu, setMenuOpen] = useState(false);

    // Get the users name
    useEffect(() => {
        async function set_avatar() {
            const username = Cookies.get("LIF_USERNAME", {domain: ".lifplatforms.com"})

            // Generate random dummy number to prevent caching
            const number = Math.floor(Math.random() * 9000000000) + 1000000000;

            document.getElementById('user-avatar').src = `${process.env.REACT_APP_AUTH_URL}/profile/get_avatar/${username}.png?dummy=${number}`;
        }
        set_avatar()
    }, [])
    

    return(
        <div className="dashboard-header" id="user-banner">
            <img id="user-avatar" alt="" />
            <h1 id="user-name">Guest</h1>
            <div className="more-icon" onClick={() => setMenuOpen(!openMenu)}>
                <img src={More} alt="" />
                <MoreMenu menuOpen={openMenu} />
            </div>
        </div>
    )
}

function Personalization() {
    const navigateTo = useNavigate();

    function navigate(page) {
        navigateTo(`/settings/${page}`);
    }

    return(
        <section className="dashboard-section">
            <h1>Personalization</h1>
            <div className="dashboard-section-items">
                <div onClick={() => navigate("personalization")}>
                    <img src={Avatar} alt="Personalization" />
                    <h1>Profile Pic</h1>
                </div>
                <div onClick={() => navigate("personalization")}>
                    <img src={Banner} alt="Personalization" />
                    <h1>Banner</h1>
                </div>
                <div onClick={() => navigate("personalization")}>
                    <img src={Bio} alt="Personalization" />
                    <h1>Bio</h1>
                </div>
            </div>
        </section>
    )
}

function Security() {
    const navigateTo = useNavigate();

    function navigate(page) {
        navigateTo(`/settings/${page}`);
    }

    return(
        <section className="dashboard-section">
            <h1>Security</h1>
            <div className="dashboard-section-items">
                <div onClick={() => navigate("security")}>
                    <img src={Security_Icon} alt="Security" />
                    <h1>Login Info</h1>
                </div>
            </div>
        </section>
    )
}

function Home() {
    // Set the username and user banner
    useEffect(() => {
        async function set_banner() {
            const username = await get_username();

            // Generate random dummy number to prevent caching
            const number = Math.floor(Math.random() * 9000000000) + 1000000000;

            const url = `${process.env.REACT_APP_AUTH_URL}/profile/get_banner/${username}.png?dummy=${number}`;
            const accountHeader = document.getElementById("user-banner");

            document.getElementById("user-name").innerHTML = username;
            if (accountHeader) {
                accountHeader.style.backgroundImage = `url(${url})`;
            }
        }
        set_banner()
    }, []);

    return (
        <div className="dashboard">
            <Header />
            <Personalization />
            <Security />
        </div>
    );
}
  
export default Home;