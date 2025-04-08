import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/users/login", data);
            console.log(res);

            if (res.status === 200) {
                const { _id, roleId } = res.data.data;

                toast.success("✅ Login successful!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });

                localStorage.setItem("id", _id);
                localStorage.setItem("role", roleId.name);

                setTimeout(() => {
                    if (roleId._id === "67c2d5637c5ffa0ab7fd4b36") {
                        navigate("/admin");
                    } else if (roleId._id === "67c2d7307c5ffa0ab7fd4b3a") {
                        navigate("/developer");
                    } else if (roleId._id === "67c2d70e7c5ffa0ab7fd4b38") {
                        navigate("/manager");
                    } else {
                        toast.error("⚠️ Invalid role. Please contact admin.");
                    }
                }, 1000);
            } else {
                toast.error("⚠️ Login failed. Please check your credentials.", {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("🚨 Login failed. Please try again!", {
                position: "top-center",
                autoClose: 2000,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-box">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Login</label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        {...register("email", { 
                            required: "Email is required", 
                            pattern: { 
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
                                message: "Enter a valid email address" 
                            }
                        })} 
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}

                    {/* Password Input with Eye Icon */}
                    <div className="password-container">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            {...register("password", { 
                                required: "Password is required", 
                                minLength: { value: 8, message: "Password must be at least 8 characters long" },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 
                                    message: "Password must contain at least one letter and one number"
                                }
                            })} 
                        />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password.message}</p>}

                    <button type="submit">Login</button>
                    <p 
                        style={{
                            marginTop: "15px",
                            color: "#5A6E58",
                            cursor: "pointer",
                            textDecoration: "underline"
                        }}
                        onClick={() => navigate("/forgotpassword")}
                    >
                        Forgot Password?
                    </p>
                </form>
            </div>
        </div>
    );
};
