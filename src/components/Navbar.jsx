import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {

  const { logout} = useAuth();
  const navigate = useNavigate();

  const handleClick = async () =>{
    const logoutsuccess = await logout();
    if(logoutsuccess){
      navigate("/login")
    }else{
      console.log("Error logout");
      navigate("/login")
    }

  }


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Viment</h1>
        <ul className="navbar-menu">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Acerca</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
        <button onClick={handleClick}>LOGOUT</button>
      </div>
    </nav>
  );
}
