import { useState } from "react";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

const MainSidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <IconContext.Provider value={{}}>
        <div className="navbar">
          <button to="#" className="menu-bar">
            <FaIcons.FaBars onClick={showSidebar} />
          </button>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <button to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </button>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};
export default MainSidebar;
