import { useState } from "react";
import { get_username } from "../scripts/get_cookie";
import "../css/settings.css";

function SideBar({setState}) {

    const username = get_username();

    return(
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={`http://localhost:8002/get_pfp/${username}.png`} />
                <h1>{username}</h1>
            </div>
            <hr />
            <div className="sidebar-buttons">
                <button>Personalization</button>
                <button>Security</button>
            </div>
        </div>
    )  
}

function SettingsPage({ state }) {
     if (state === "personalization") {
        return(
            <div className="settings">
                <h1>Personalization</h1>
                <div className="personalization-options">
                    <div>
                        <h1>Profile Photo</h1>
                        <button>Change</button>
                    </div>
                    <hr />
                    <div>
                        <h1>Profile Banner</h1>
                        <button>Change</button>
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