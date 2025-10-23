import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import HomeLayout from "./components/layout/homeLayout";
import Login from "./pages/Login";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import ChatPage from "./pages/Chat/ChatPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAstrologers from "./pages/Admin/AdminAstrologers";
import ChatbotPage from "./pages/Chatbot/ChatbotPage";
import RestrictUser from "./components/restrictUser";
import UserProfileUpdate from "./pages/User/UserProfileUpdate";
import AstrologersPage from "./pages/Astrologers";
import AstroDashboard from "./pages/Astrologer/AstroDashboard";
import AstrologerDetailPage from "./pages/AstrologerDetail";
import RestrictAstro from "./components/restrictAstro";
import AstroRegister from "./pages/AstroRegister";
import Checkout from "./pages/Checkout";
import UserDashboard from "./pages/User/UserDashboard";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Landing />} /> */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/astrologers" element={<AstrologersPage />} />
          <Route path="/astrologers/:id" element={<AstrologerDetailPage />} />

          <Route element={<RestrictUser />}>
            <Route path="/user/update" element={<UserProfileUpdate />} />
            <Route path="/chat/:appointmentId" element={<ChatPage />} />
            <Route path="/astro/register" element={<AstroRegister />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<RestrictAstro />}>
            <Route path="/astro/dashboard" element={<AstroDashboard />} />
          </Route>

          <Route path="/checkout/:appointmentId" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* <Route path="/admin/users" element={<AdminUsers />} /> */}
          <Route path="/admin/astrologers" element={<AdminAstrologers />} />
          {/* <Route path="/admin/appointments" element={<AdminAppointments />} /> */}
          {/* <Route path="/admin/payments" element={<AdminPayments />} /> */}
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
