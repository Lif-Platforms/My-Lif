import Logo from "./assets/Lif_Logo.png"

function Login() {
    return(
        <div className="LoginPage">
            <div className="LoginForm">
                <img src={Logo} alt="Lif-Logo" />
                <form>
                    <input type="Username" id="Username" />
                    <input type="Password" id="Password" />
                    <button type="buttton">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;