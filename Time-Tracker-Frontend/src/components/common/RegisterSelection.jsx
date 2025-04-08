import { useNavigate } from "react-router-dom";
import "../../assets/css/RegisterSelection.css";

export const RegisterSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        navigate(`/signup?role=${role}`); // Always navigate to signup with selected role
    };

    return (
        <div className="register-selection-container">
            <h2>Select Your Role</h2>
            <div className="roles-container">
                <div className="role-box admin" onClick={() => handleRoleSelection("Admin")}>
                    <h3>Admin</h3>
                </div>
                <div className="role-box developer" onClick={() => handleRoleSelection("Developer")}>
                    <h3>Developer</h3>
                </div>
                <div className="role-box project-manager" onClick={() => handleRoleSelection("Project Manager")}>
                    <h3>Project Manager</h3>
                </div>
            </div>
        </div>
    );
};
