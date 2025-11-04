import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/navbar.css";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login"));
  const navigate = useNavigate();

  useEffect(()=>{
   const handelStorage = ()=>{
    setIsLoggedIn(localStorage.getItem("login"))
   }
   window.addEventListener("localStorage-change" , handelStorage)
   return ()=>{
    window.removeEventListener("localStorage-change" , handelStorage)
   } 

  } , [])

  const handleLogout = () => {
    localStorage.removeItem("login");
    setIsLoggedIn(null);
    setTimeout(() => {
    navigate("/login");  
    }, 0);
    
  };
  

  return (
    <nav className="navbar">
      <div className="logo">To-Do App</div>
      <ul className="nav-links">
        {isLoggedIn && (
          <>
            <li> <Link to="/">List</Link></li>
            <li> <Link to="/add">Add Task</Link> </li>
            <li><Link onClick={handleLogout}>Logout</Link></li>
            
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
