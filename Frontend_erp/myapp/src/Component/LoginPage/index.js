import {Component} from "react";
import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import "./index.css";

class LoginPage  extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordVisible: false,
      emailInput: "",
      passwordInput: "",
    };
  }

  onTogglePasswordVisibility = () => {
    this.setState((prevState) => ({
      passwordVisible: !prevState.passwordVisible
    }));
  }

  onSubmitLoginForm = async (event) => {
    event.preventDefault();
    const {emailInput , passwordInput} = this.state;
    const bodyDetails = {
      email: emailInput,
      password: passwordInput,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyDetails),
  }
    const response = await fetch("http://localhost:5000/auth/login", options);
    const data = await response.json();
    console.log(data);
    if (response.ok === true) {
      const {token} = data;
      localStorage.setItem("token", token);
      const {history} = this.props;
      history.replace("/");
    } else {
      alert(data.message);
    }
}

  emailInputing = (event) => {
    this.setState({emailInput: event.target.value});
  }

    passwordInputing = (event) => {
    this.setState({passwordInput: event.target.value});
  }

  render() {
    const {passwordVisible , emailInput , passwordInput} = this.state;
    const token = localStorage.getItem("token");
    if (token !== null) {
      const {history} = this.props
      history.replace("/");
    }
    return ( <div className="login-page-container">
        <h4 className="heading-login">Welcome to Login Page</h4>
        <h5 className="welcome-text">Mini ERP & Finance System</h5>
        <div className="login-card-container">
        <div className="login-card">
          <form className="login-form" onSubmit={this.onSubmitLoginForm}>
              <label
                htmlFor="email"
                >Email:</label>
                <br />
              <input
                type="email"
                id="email"
                name="email"
                className="email"
                placeholder="Enter your email"
                onChange={this.emailInputing}
                value={emailInput}
                required
              />
              <br />
              <label 
                htmlFor="password"
                >Password:</label>
                <div className="password-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="password"
                  placeholder="Enter your password"
                  onChange={this.passwordInputing}
                  value={passwordInput}
                  required
                />
                <button type="button" className="button-password" onClick={this.onTogglePasswordVisibility}>
                  {passwordVisible
                    ? <IoMdEyeOff />
                    : <IoEye />}
                </button>
              </div>
              <br />
              <button type="submit">Login</button>
              <Link to="/register"><p>New User?</p></Link>
          </form>
        </div>
        </div>
    </div>)
  }
}


export default LoginPage;