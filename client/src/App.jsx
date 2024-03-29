import { BrowserRouter , Routes , Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Footer from "./components/Footer";



export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sign-In" element={<Signin/>}/>
        <Route path="/signUp" element={<Signup/>}/>
        <Route path="/listing/:listingId" element={<Listing/>}/>
        <Route path="/search" element={<Search/>}/>       

        <Route element={<PrivateRoute/>}>                  {/*PrivateRoute is a component that we created to protect routes that require authentication.*/}
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/create-listing" element={<CreateListing/>}/>
          <Route path="/update-listing/:listingId" element={<UpdateListing/>}/>
        </Route>
      
      </Routes>
      <Footer/> 
    </BrowserRouter> // BrowserRouter: Manages navigation between different views in your React app, keeping the URL in sync with what's displayed on the screen. It's like a built-in GPS for our app's user interface.
  )
}
