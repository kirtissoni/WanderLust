import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavbarNew from "./components/NavbarNew";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import NewListing from "./pages/NewListing";
import EditListing from "./pages/EditListing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import BookingForm from "./pages/BookingForm";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <NavbarNew />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/new" element={<NewListing />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/listings/:id/edit" element={<EditListing />} />
              <Route path="/listings/:id/book" element={<BookingForm />} />
              <Route path="/bookings/my-bookings" element={<MyBookings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
