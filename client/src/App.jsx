import { BrowserRouter , Routes , Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Header from "./components/Header";



export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/sign-In" element={<Signin/>}/>
        <Route path="/signUp" element={<Signup/>}/>
      </Routes> 
    </BrowserRouter> // BrowserRouter: Manages navigation between different views in your React app, keeping the URL in sync with what's displayed on the screen. It's like a built-in GPS for our app's user interface.
  )
}
