import { useState, useEffect } from "react";
import { get_username } from "../scripts/get_cookie";
import "../css/settings.css";

function SideBar({ setState }) {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await get_username();
                setUsername(result);

            } catch (error) {
                console.error("Error fetching username:", error);
            }
        }

        fetchData();
    }, []);

    if (username === null) {
        // You can render a loading indicator here if needed
        return <div>Loading...</div>;
    }

    function navigate(page) {
        // Get a reference to the parent <div>
        const parentDiv = document.getElementById('sidebar-buttons'); // Replace 'parentDiv' with the actual ID of your parent <div>

        // Iterate through child <div> elements
        const childDivs = parentDiv.querySelectorAll('div'); // You can adjust the selector as needed
        childDivs.forEach((div) => {
        // Check if the div has the class 'example-class' (replace with your desired class)
        if (div.classList.contains('active')) {
            // Remove the class
            div.classList.remove('active');
        }
        });

        // Add active class to selected option
        document.getElementById(page).classList.add("active");

        setState(page);
    }

    return (
    <div className="sidebar">
        <div className="sidebar-header">
            <img src={`http://localhost:8002/get_pfp/${username}.png`} alt={`Profile picture of ${username}`} />
            <h1>{username}</h1>
        </div>
        <hr />
        <div className="sidebar-buttons" id="sidebar-buttons">
            <button id="personalization" onClick={() => navigate('personalization')}>Personalization</button>
            <button id="security" onClick={() => navigate('security')}>Security</button>
        </div>
    </div>
    );
}

function SettingsPage({ state }) {
     if (state === "personalization") {
        return(
            <div className="settings">
                <h1>Personalization</h1>
                <div className="personalization-options">
                    <div>
                        <h1>Profile Photo</h1>
                        <button>Choose</button>
                    </div>
                    <hr />
                    <div>
                        <h1>Profile Banner</h1>
                        <button>Choose</button>
                    </div>
                </div>
            </div>
        )
     }
}

function Settings() {
    const [pageState, setPageState] = useState('personalization');

    return(
        <div className="settings-page">
            <SideBar setState={setPageState} />
            <SettingsPage state={pageState} /> 
        </div>
    )
}

export default Settings;