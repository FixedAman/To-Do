import { useState } from "react";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./sidebarData";

const MainSidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <IconContext.Provider value={{ size: "20px" }}>
        <div className="navbar md:hidden flex  items-center justify-between  p-3 bg-zinc-950 text-white">
          <button
            className="menu-bar bg-amber-300 text-black p-2 rounded"
            onClick={showSidebar}
          >
            <FaIcons.FaBars
              aria-expanded={sidebar}
              aria-label={sidebar ? "close menu " : "Open menu"}
            />
          </button>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items bg-yellow-500">
            <li className="navbar-toggle">
              <button className="menu-bars" onClick={showSidebar}>
                <AiIcons.AiOutlineClose />
              </button>
            </li>
           {
            SidebarData.map((item , index)=>{
              return (
                <li key={index}>
                    
                </li>
              )
            })
           }
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};
export default MainSidebar;
