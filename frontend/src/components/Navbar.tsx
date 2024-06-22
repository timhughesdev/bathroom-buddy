import { Link } from "react-router-dom"
import '/images/home.svg'
import '/images/log-in.svg'
import '/images/log-out.svg'
import '/images/user-plus.svg'
import '/images/logo.png'
import './navbar.css'



const Navbar = () => {
    return (<>
        <nav className="navbar navbar-expand-lg fixed-top mb-5 justify-content-center bg-body-tertiary-custom">
            <div className="container-fluid ">
                <Link className="navbar-brand" to="/"><span className="d-flex align-items-center navwhite">
                <img className="homelogo" src="/images/logo.png" alt="Home icon" /></span></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                            <Link className="nav-link " to="/"> <span className="d-flex align-items-center navwhite">
                                <img src="/images/home.svg" alt="Home icon" />
                                <span className="ms-2">Home</span>
                            </span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup"><span className="d-flex align-items-center navwhite">
                                <img src="/images/user-plus.svg" alt="Sign up icon" />
                                <span className="ms-2">signup</span>
                            </span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login"><span className="d-flex align-items-center navwhite">
                                <img src="/images/log-in.svg" alt="lgo in icon" />
                                <span className="ms-2">login</span>
                            </span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/logout"><span className="d-flex align-items-center navwhite">
                                <img src="/images/log-out.svg" alt="Log out icon" />
                                <span className="ms-2">logout</span>
                            </span></Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>

    </>)

}

export default Navbar