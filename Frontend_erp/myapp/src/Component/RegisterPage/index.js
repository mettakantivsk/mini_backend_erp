import { Component } from "react";
import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import "./index.css";

class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordVisible: false , 
      email : "" ,
      password : "" ,
      name : "" ,
      role : "admin",
    };
  }

  onTogglePasswordVisibility = () => {
    this.setState((prevState) => ({
      passwordVisible: !prevState.passwordVisible
    }));
  }

  nameing = (event) => {
    this.setState({name: event.target.value});
  }

  emailing = (event) => {
    this.setState({email: event.target.value});
  }

  passwording = (event) => {
    this.setState({password: event.target.value});
  }

  registrationCompleted = async (event) => {
    event.preventDefault();
    const {name , email , password , role} = this.state;
    const bodyDetails = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyDetails),
    };
    const response = await fetch("http://localhost:5000/auth/register", options);
    const data = await response.json();
    console.log(data);
    if (response.ok === true) {
      const {history} = this.props
      alert("Registration Successful. Please Login Now.");
      history.replace("/login");
    } else {
      alert(data.message);
    }
  }


  render() {
    const { passwordVisible , password , name , email } = this.state;
    const token = localStorage.getItem("token");
    if (token !== null) {
      const {history} = this.props
      history.replace("/");
    }

    return (
      <div className="login-page-container">
        <h4 className="heading-login">Mini ERP & Finance System</h4>
        <h5 className="welcome-text">Create Your Account</h5>

        <div className="login-card">
          <form className="login-form" onSubmit={this.registrationCompleted}>

            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="email"
              onChange={this.nameing}
              value={name}
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={this.emailing}
              className="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                className="password"
                onChange={this.passwording}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="button-password"
                onClick={this.onTogglePasswordVisibility}
              >
                {passwordVisible ? <IoMdEyeOff /> : <IoEye />}
              </button>
            </div>

            <button type="submit">Register</button>

            <Link to="/login">
              <p>Already have an account? Login</p>
            </Link>

          </form>
        </div>
      </div>
    );
  }
}

export default RegisterPage;
