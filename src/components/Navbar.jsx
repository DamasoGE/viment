import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Viment</h1>
        <ul className="navbar-menu">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Acerca</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
        <button>LOGIN</button>
      </div>
    </nav>
  );
}
