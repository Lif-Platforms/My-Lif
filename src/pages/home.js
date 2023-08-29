import { get_username } from "../scripts/get_cookie";
import "../css/dashboard.css";
import { useEffect } from 'react';
import Personalization from "../assets/Personalization.png";
import Security from "../assets/security.png";

function Home() {
    const username = get_username();

    useEffect(() => {
        const url = `http://localhost:8002/get_banner/${username}.png`;
        const accountHeader = document.getElementById("account-header");
        if (accountHeader) {
            accountHeader.style.backgroundImage = `url(${url})`;
        }
    }, [username]);

    return (
        <div className="App">
            <header id="account-header">
                <div>
                    <img src={`http://localhost:8002/get_pfp/${username}.png`} alt="" />
                    <h1>Welcome Back {username}</h1>
                </div>
            </header>
            <div className="dashboard">
                <button>
                    <img src={Personalization} alt="" draggable={false} />
                    <p>Personalization</p>
                </button>
                <button>
                    <img src={Security} alt="" draggable={false} />
                    <p>Security</p>
                </button>
            </div>
        </div>
    );
}
  
export default Home;