import React from "react";
import './login.css';
import {Link} from "react-router-dom";

function LoginPage() {
    return (
        <div className="login-container">
            <div className="navbar-login">
                <Link to="/">
                <button className='logo'>
                   <i className='material-icons'>
                       arrow_back
                   </i> Home
                </button>
                    </Link>
            </div>
            <div className="login-content">
                <div className="login-form">
                    <div className='label'>Login to endsem <i className='material-icons'>login</i> </div>
                    <input className='login-username'  placeholder='Enter Email' type='text'/>
                    <input className='login-password' placeholder='Enter Password' type='password'/>
                    <div className='submissions'>
                        <button type='submit' className="login-submit-button">Submit <i
                            className='material-icons'>outbound</i></button>
                        <button type='reset' className="reset-submit-button">Reset <i
                            className='material-icons'>backspace</i></button>
                    </div>
                </div>
            </div>
            <div className="login-image"></div>
        </div>
    );
}

export default LoginPage;
