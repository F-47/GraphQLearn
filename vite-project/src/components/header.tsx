import logo from "../assets/logo.png";

export default function Header() {
  return (
    <nav className="navbar mb-4 py-5">
      <div className="container">
        <a className="navbar-brand" href="/">
          <div className="flex items-center ">
            <img src={logo} alt="logo" className="mr-2" />
            <div>ProjectMgmt</div>
          </div>
        </a>
      </div>
    </nav>
  );
}
