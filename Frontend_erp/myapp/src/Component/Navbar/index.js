import {Link} from "react-router-dom";
import { withRouter } from "react-router-dom";

import "./index.css";


const Navbar = (props) => {

    const logingOut = () => {
    localStorage.removeItem("token");
    const {history} = props;
    history.replace("/login");
}

    return (
        <div className="navbar">
            <div>
            <h3>Building construction field</h3>
            </div>
            <div className="nav-links">
                <Link  to="/" className="nav-link" >Home</Link>
                <Link to="/addproject" className="nav-link" >Add Project</Link>
                <button type="button" className="btn-logout" onClick={logingOut}>logout</button>
            </div>
        </div>
    );
}   

export default withRouter(Navbar);