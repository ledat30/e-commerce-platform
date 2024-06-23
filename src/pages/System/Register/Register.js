import { useState } from 'react';
import './Register.scss';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from '../../../services/userService';

function Register() {
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toLogin = () => {
        navigate("/login");
    }

    const handleRegister = async () => {
        if (!email || !phone || !username || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        let response = await registerUser({ email, username, phone, password });

        if (response && +response.EC === 0) {
            toast.success(response.EM);
            navigate("/login");
        }
    }

    return (
        <div className="login-container">
            <div className="screen-2">
                <div className="title-login">Register</div>
                <div className="email">
                    <label htmlFor="email">Email Address</label>
                    <div className="sec-2">
                        <i className="fa fa-envelope-o" aria-hidden="true"></i>
                        <input
                            type="email"
                            name="email"
                            placeholder="Username@gmail.com"
                            className="email-user"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="email">
                    <label htmlFor="email">PhoneNumber</label>
                    <div className="sec-2">
                        <i className="fa fa-phone" aria-hidden="true"></i>
                        <input
                            type="email"
                            name="email"
                            placeholder="+0386582177"
                            className="email-user"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                <div className="email">
                    <label htmlFor="email">Username</label>
                    <div className="sec-2">
                        <i className="fa fa-envelope-o" aria-hidden="true"></i>
                        <input
                            type="email"
                            name="email"
                            placeholder="Please enter a username"
                            className="email-user"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <div className="sec-2">
                        <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                        <input
                            className="pas"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Please enter a password!"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i
                            className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                            aria-hidden="true"
                            onClick={togglePasswordVisibility}
                        ></i>
                    </div>
                </div>
                <button className="login" onClick={() => handleRegister()}>
                    Register
                </button>
                <div className="footer-login">
                    <span className="forgot-password" onClick={toLogin}>Login ?</span>
                </div>
            </div>
        </div>
    );
}

export default Register;