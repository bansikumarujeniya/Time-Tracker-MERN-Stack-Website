import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/Signup.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Password visibility state

    // Extract role from URL
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get("role");

    // Role to roleId mapping
    const roleMapping = {
        "Admin": "67c2d5637c5ffa0ab7fd4b36",
        "Developer": "67c2d7307c5ffa0ab7fd4b3a",
        "Project Manager": "67c2d70e7c5ffa0ab7fd4b38"
    };

    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);

        try {
            const userData = { ...data, roleId: roleMapping[role] };

            const res = await axios.post("/users/signup", userData);
            console.log("Signup Response:", res);

            if (res.status === 201) {
                toast.success("🎉 User added successfully!", {
                    position: "top-center",
                    autoClose: 1500,
                    theme: "light",
                    transition: Bounce,
                });

                // Store user in localStorage
                localStorage.setItem("user", JSON.stringify(res.data.data));

                // Delay navigation for better user experience
                setTimeout(() => {
                    redirectToRolePage(roleMapping[role]);
                }, 1700);
            }
        } catch (error) {
            console.error("Signup Error:", error);

            if (error.response) {
                const { status, data } = error.response;

                if (status === 400 || status === 401) {
                    toast.error(`⚠️ ${data.message || "Signup failed. Try again."}`, {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "light",
                        transition: Bounce,
                    });
                } else if (data.code === 11000) {
                    toast.error("⚠️ Email already exists. Try logging in.", {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "light",
                        transition: Bounce,
                    });
                } else {
                    toast.error("🚨 Something went wrong!", {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "light",
                        transition: Bounce,
                    });
                }
            } else {
                toast.error("🚨 Server error! Please try again later.", {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const redirectToRolePage = (roleId) => {
        if (roleId === "67c2d5637c5ffa0ab7fd4b36") {
            navigate("/admin");
        } else if (roleId === "67c2d7307c5ffa0ab7fd4b3a") {
            navigate("/developer");
        } else if (roleId === "67c2d70e7c5ffa0ab7fd4b38") {
            navigate("/manager");
        } else {
            navigate("/login"); // Default redirection
        }
    };

    return (
        <div className="signup-container">
            <ToastContainer position="top-center" autoClose={2000} theme="light" transition={Bounce} />
            <div className="signup-box">
                <h2 style={{ background: "#D0DDD0", padding: "10px", borderRadius: "10px" }}>{role} Registration</h2>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <input type="text" placeholder="First Name" {...register("firstName", { required: "First name is required" })} />
                    {errors.firstName && <p className="error">{errors.firstName.message}</p>}

                    <input type="text" placeholder="Last Name" {...register("lastName", { required: "Last name is required" })} />
                    {errors.lastName && <p className="error">{errors.lastName.message}</p>}

                    <input type="email" placeholder="Email" {...register("email", { 
                        required: "Email is required", 
                        pattern: { 
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
                            message: "Enter a valid email address" 
                        }
                    })} />
                    {errors.email && <p className="error">{errors.email.message}</p>}

                    {/* Password Input with Eye Toggle */}
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
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password.message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                    <button type="button" onClick={() => navigate("/login")} className="already-registered-btn">
                        Already Registered?
                    </button>

                    <button type="button" onClick={() => navigate("/register")} className="switch-account-btn">
                        Switch Account
                    </button>
                </form>
            </div>
        </div>
    );
};
