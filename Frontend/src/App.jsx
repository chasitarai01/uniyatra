import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Home from "./Pages/Home.jsx";
import UserDashboard from "./Pages/UserDashboard.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import UniversityListing from "./Pages/Unipages/unipage.jsx";
import { SingleUni } from "./Pages/Unipages/singleuni.jsx";
import { Courses } from "./Pages/Unipages/Courses.jsx";
import { Scholarships } from "./Pages/Unipages/Scholarships.jsx";
import UniversityCourses from "./Pages/Coursepages/UniversityCourses.jsx";
import ScholarshipList from "./Pages/Scholarship/Singlescholarship.jsx";
import ScholarshipsByUniversity from "./Pages/Scholarship/ScholarshipsByUniversity.jsx";
import ScholarshipsPage from "./Pages/Scholarship/Allscholarship.jsx";
import AllScholarship from "./Pages/Scholarship/Allscholarship.jsx";
import SingleScholarship from "./Pages/Scholarship/Singlescholarship.jsx";
import FileUpload from "./Pages/Filepage/file.jsx";
import ChecklistPage from "./Pages/Checklist/checklistpage.jsx";
import EligibilityTest from "./Pages/Eligibility/eligibilty.jsx";
import FavoriteUniversities from "./Pages/Fetch fav/favfetch.jsx";
import Nav from "./Components/navbar.jsx";
import AdminDashboard from "./Pages/Adminpage/admindashboard.jsx";
import UniversityManagement from "./Pages/Adminpage/UniversityManagement.jsx";
import CourseManagement from "./Pages/Adminpage/CourseManagement.jsx";
import ScholarshipManagement from "./Pages/Adminpage/ScholarshipManagement.jsx";
import NotificationForm from "./Pages/Adminpage/AdminSendNotification.jsx";
import UserNotifications from "./Components/usernotification.jsx";
import AdminRooms from "./Pages/Adminpage/AdminRooms.jsx";
import AdminVideoRoom from "./Pages/Adminpage/Adminvideoroom.jsx";
import UserRooms from "./Pages/Userroom/Userrooms.jsx";
import UserVideoRoom from "./Pages/Userroom/Uservideoroom.jsx";
import UserReminders from "./Pages/Reminderuser/userreminders.jsx";
import SupportChat from "./Pages/SupportChat/SupportChat.jsx";
import CostEstimator from "./Pages/CostEstimator/CostEstimator.jsx";
import DirectChatWidget from "./Components/DirectChatWidget.jsx";
import AdminLayout from "./Components/AdminLayout.jsx";
import UserLayout from "./Components/UserLayout.jsx";
import Logout from "./Pages/Logout.jsx";
import AdminUniversityDetails from "./Pages/Adminpage/AdminUniversityDetails.jsx";
import AdminScholarshipDetails from "./Pages/Adminpage/AdminScholarshipDetails.jsx";
import UserUniversityList from "./Pages/UserUniversityList.jsx";
import UserScholarshipList from "./Pages/UserScholarshipList.jsx";
import AdminUserManagement from "./Pages/Adminpage/AdminUserManagement.jsx";
import AdminChecklistManagement from "./Pages/Adminpage/AdminChecklistManagement.jsx";
import SupportDashboard from "./Pages/SupportChat/SupportDashboard.jsx";
import SmartAssistant from "./Components/SmartAssistant.jsx";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/admin') || 
                  location.pathname.startsWith('/dashboard') ||
                  location.pathname === '/login' ||
                  location.pathname === '/register' ||
                  location.pathname === '/forgot-password' ||
                  location.pathname.startsWith('/reset-password') ||
                  location.pathname.startsWith('/file') ||
                  location.pathname.startsWith('/checklist') ||
                  location.pathname.startsWith('/test') ||
                  location.pathname.startsWith('/fav') ||
                  location.pathname.startsWith('/notification') ||
                  location.pathname.startsWith('/classes') ||
                  location.pathname.startsWith('/reminder') ||
                  location.pathname.startsWith('/support-chat') ||
                  location.pathname.startsWith('/cost-estimator') ||
                  location.pathname.startsWith('/room/');
  
  return (
    <>
      {!hideNav && <Nav />}
      {!hideNav && <DirectChatWidget />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/home" element={<Home />} />
          
          <Route path="/uni" element={<UniversityListing />} />
          <Route path="/uni/:id" element={<SingleUni />} />
          <Route path="/uni/:id/courses" element={<Courses />} />
          <Route path="scholar" element={<SingleScholarship />} />
          <Route path="/courses/:code" element={<UniversityCourses />} />
          <Route path="/uni/:id/scholarships" element={<ScholarshipsByUniversity />} />
          <Route path="/scholarship" element={<AllScholarship />} />
          {/* user dashboard */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/universities" element={<UserUniversityList />} />
            <Route path="/dashboard/university/:id" element={<SingleUni />} />
            <Route path="/dashboard/university/:id/courses" element={<Courses />} />
            <Route path="/dashboard/university/:id/scholarships" element={<ScholarshipsByUniversity />} />
            <Route path="/dashboard/scholarships" element={<UserScholarshipList />} />
            <Route path="/dashboard/scholarship/:id" element={<SingleScholarship />} />
            <Route path="/file" element={<FileUpload />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/test" element={<EligibilityTest />} />
            <Route path="/fav" element={<FavoriteUniversities />} />
            <Route path="/notification" element={<UserNotifications/>} />
            <Route path="/classes" element={<UserRooms />} />
            <Route path="/reminder" element={<UserReminders />} />
            <Route path="/support-chat" element={<SupportDashboard />} />
          </Route>

          {/* Standalone full-screen routes (no sidebar) */}
          <Route path="/room/:roomCode" element={<UserVideoRoom />} />
          <Route path="/cost-estimator" element={<CostEstimator />} />

          {/* admin */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/checklists" element={<AdminChecklistManagement />} />
            <Route path="/admin/universities" element={<UniversityManagement />} />
            <Route path="/admin/universities/:id" element={<AdminUniversityDetails />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/scholarships" element={<ScholarshipManagement />} />
            <Route path="/admin/scholarships/:id" element={<AdminScholarshipDetails />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/notifications" element={<NotificationForm />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
          </Route>
          <Route path="/admin/room/:roomCode" element={<AdminVideoRoom />} />
        </Routes>
        <SmartAssistant />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
