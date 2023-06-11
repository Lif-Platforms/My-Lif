import Logo from "./assets/Lif_Logo.png"
import './login.css';
import { login } from "./scripts/login";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate(); 

    // Function for handling the login process
    async function handle_login() {
        // Changes the login buttons state
        const login_button = document.getElementById("login_button");
        login_button.innerHTML = "Logging In...";
        login_button.disabled = true;

        // Gets the username and password from the login form
        const username_input = document.getElementById('Username');
        const password_input = document.getElementById('Password');

        const username = username_input.value;
        const password = password_input.value; 

        // Logs in the user with the lif auth server
        try {
            const login_status = await login(username, password);
            console.log("login Status: " + login_status);
            login_button.innerHTML = "Done!";
            navigate("/");

          } catch (error) {
            console.error("Login failed:", error);
          }
    }   

    return(
        <div className="LoginPage">
            <div className="LoginForm">
                <img src={Logo} alt="Lif-Logo" />
                <h1>Login With Lif</h1>
                <form>
                    <input type="Username" id="Username" placeholder="Username" />
                    <br />
                    <input type="Password" id="Password" placeholder="Password"/>
                    <br />
                    <button type="button" id='login_button' onClick={handle_login}>Login</button>
                </form>
                <br />
                <a href="#">Forgot Password</a>
            </div>
        </div>
    )
}

export default Login;