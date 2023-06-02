import Logo from "./assets/Lif_Logo.png"
import './login.css';

function Login() {
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
                    <button type="button">Login</button>
                </form>
                <br />
                <a href="#">Forgot Password</a>
            </div>
        </div>
    )
}

export default Login;