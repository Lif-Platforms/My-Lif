import { get_username } from "../scripts/get_cookie";
import "../css/dashboard.css";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Asset Import
import Avatar from "../assets/dashboard/avatar.svg";
import Banner from '../assets/dashboard/banner.svg';
import Placeholder from "../assets/placeholder-banner.png";
import Bio from "../assets/dashboard/bio.svg";
import Security_Icon from "../assets/dashboard/security.svg";

function Header() {
    // Get the users name
    useEffect(() => {
        async function set_avatar() {
            const username = await get_username();
            document.getElementById('user-avatar').src = `${process.env.REACT_APP_AUTH_URL}/get_pfp/${username}.png`;
        }
        set_avatar()
    }, [])
    

    return(
        <div className="dashboard-header" id="user-banner">
            <img id="user-avatar" alt="" />
            <h1 id="user-name">Guest</h1>
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

            const url = `${process.env.REACT_APP_AUTH_URL}/get_banner/${username}.png`;
            const accountHeader = document.getElementById("user-banner");

            document.getElementById("user-name").innerHTML = username;
            if (accountHeader) {
                accountHeader.style.backgroundImage = `url(${url})`;
            }
        }
        set_banner()
    }, []);

    // Create navigation instance
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        // Get auth cookies
        const username = Cookies.get("LIF_USERNAME");
        const token = Cookies.get("LIF_TOKEN");

        // Check if cookies exist and redirect to login if necessary
        if (!username && !token) {
            navigate("/login");
        }
    }, [])

    return (
        <div className="App">
            <Header />
            <Personalization />
            <Security />
        </div>
    );
}
  
export default Home;