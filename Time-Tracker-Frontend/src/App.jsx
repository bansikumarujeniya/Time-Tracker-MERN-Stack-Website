import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./assets/css/adminlte.css";
import "./assets/css/adminlte.min.css";
import { Login } from "./components/common/Login";
import { Signup } from "./components/common/Signup";
import "./App.css";
import { AdminSidebar } from "./components/admin/AdminSidebar";
import { DeveloperSidebar } from "./components/developer/DeveloperSidebar";
import { ManagerSidebar } from "./components/manager/ManagerSidebar";
import axios from "axios";
import { RegisterSelection } from "./components/common/RegisterSelection";
import { AddProjectForm } from "./components/manager/AddProjectForm";
import PrivateRoutes from "./hooks/PrivateRoutes";
import ProjectList from "./components/manager/ProjectList";
import LandingPage from "./components/common/LandingPage";
import ProjectDetails from "./components/manager/ProjectDetails";
import ModulesList from "./components/manager/ModulesList";
import AddModuleForm from "./components/manager/AddModuleForm";
import TaskList from "./components/manager/TaskList";
import AddTaskForm from "./components/manager/AddTaskForm";
import TaskAssignment from "./components/manager/TaskAssignment";
import DeveloperTaskList from "./components/developer/DeveloperTaskList";
import DeveloperTaskDetails from "./components/developer/DeveloperTaskDetails";
import DeveloperTimeLogger from "./components/developer/DeveloperTimeLogger";
import { ResetPassword } from "./components/common/ResetPassword";
import { ForgotPassword } from "./components/common/ForgotPassword";
import DeveloperTimeLogList from "./components/developer/DeveloperTimeLogList";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUserManagement from "./components/admin/AdminUserManagement";
import AdminModuleManagement from "./components/admin/AdminModuleManagement";
import AdminProjectManagement from "./components/admin/AdminProjectManagement";
import AdminTaskManagement from "./components/admin/AdminTaskManagement";
import AdminTimeLogManagement from "./components/admin/AdminTimeLogManagement";
import AdminBilling from "./components/admin/AdminBilling";
import AdminReport from "./components/admin/AdminReport";


function App() {

  axios.defaults.baseURL = "http://localhost:3000"

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = "";
    } else {
      document.body.className =
        "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
    }
  }, [location.pathname]);

  return (
    <div className={location.pathname === "/login" || location.pathname === "/signup" ? "" : "app-wrapper"}>
      <Routes>
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterSelection />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="" element={<PrivateRoutes />}>
          <Route path="/admin" element={<AdminSidebar />}>
            <Route index element={<Navigate to="dashboard" />} /> 
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="usermanagement" element={<AdminUserManagement />} />
            <Route path="modulemanagement" element={<AdminModuleManagement />} />      
            <Route path="projectmanagement" element={<AdminProjectManagement />} />      
            <Route path="taskmanagement" element={<AdminTaskManagement />} />      
            <Route path="timelogmanagement" element={<AdminTimeLogManagement />} />      
            <Route path="billingmanagement" element={<AdminBilling />} />      
            <Route path="reportmanagement" element={<AdminReport />} />                     
          </Route>
          <Route path="/developer" element={<DeveloperSidebar />}>
            <Route index element={<Navigate to="developertasklist" />} />
            <Route path="developertasklist" element={<DeveloperTaskList />} />
            <Route path="developertasklist/:taskId" element={<DeveloperTaskDetails />} /> 
            <Route path="timelogger" element={<DeveloperTimeLogger />} />
            <Route path="timeloglist" element={<DeveloperTimeLogList />} />
          </Route>
          <Route path="/manager" element={<ManagerSidebar />}>
            <Route index element={<Navigate to="projectlist" />} />
            <Route path="addprojectform" element={<AddProjectForm />} />
            <Route path="projectlist" element={<ProjectList />} />
            <Route path="projectlist/:id" element={<ProjectDetails />} />
            <Route path="modulelist" element={<ModulesList />} />
            <Route path="projectlist/:projectId/modules" element={<ModulesList />} />
            <Route path="projectlist/:projectId/add-module" element={<AddModuleForm />} />
            <Route path="projectlist/modules/:moduleId/tasks" element={<TaskList />} />
            <Route path="projectlist/modules/:moduleId/add-task" element={<AddTaskForm />} />
            <Route path="taskassignment" element={<TaskAssignment />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;