import Logo from "../assets/Lif_Logo.png"
import '../css/login.css';
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
        fetch(`http://localhost:8002/login/${username}/${password}`)
        .then(response => {
            if (response.ok) {
            return response.json(); // Convert response to JSON
            } else {
            throw new Error('Request failed with status code: ' + response.status);
            }
        })
        .then(data => {
            // Work with the data
            console.log(data);
            
            if (data.Status === "Successful") {
                document.cookie = "LIF_TOKEN=" + data.Token;
                document.cookie = "LIF_USERNAME=" + username;

                navigate('/');
            } else {
                document.getElementById('login_status').innerHTML = "Incorrect Username or Password";
                document.getElementById('login_button').innerHTML = "Login";
                document.getElementById('login_button').disabled = false;
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
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
                <span id="login_status" className="login-status"></span>
                <a href="#">Forgot Password</a>
            </div>
            <div className="create-account">
                <p>Don't have an account?</p>
                <a href="/create_account">Create One!</a>
            </div>
        </div>
    )
}

export default Login;