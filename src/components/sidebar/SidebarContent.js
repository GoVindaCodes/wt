// import React, { useContext } from "react";
// import { NavLink, Route } from "react-router-dom";
// import Cookies from "js-cookie";
// import { Button, WindmillContext } from "@windmill/react-ui";
// import { IoLogOutOutline } from "react-icons/io5";
// import logoDark from "assets/img/logo/logo.png";
// import logoLight from "assets/img/logo/logo.png";

// import sidebar from "routes/sidebar";
// import { AdminContext } from "context/AdminContext";
// import SidebarSubMenu from "./SidebarSubMenu";
// // import SidebarSubMenu from "SidebarSubMenu";
// import { useTranslation } from "react-i18next";
// const SidebarContent = () => {
//   const { t } = useTranslation();
//   const { mode } = useContext(WindmillContext);
//   const { dispatch } = useContext(AdminContext);


//   const handleLogOut = () => {
//     dispatch({ type: "USER_LOGOUT" });
//     Cookies.remove("adminInfo");
//   };

//   return (
//     <div className="py-4 text-gray-500 dark:text-gray-400">
//       <a className=" text-gray-900 dark:text-gray-200" href="/dashboard">
//         {mode === "dark" ? (
//           <img src={logoLight} alt="dashtar" width="150" className="pl-6" />
//         ) : (
//           <img src={logoDark} alt="dashtar" width="160" className="pl-6" />
//         )}
//       </a>
//       <ul className="mt-8">
//         {sidebar.map((route) =>
//           route.routes ? (
//             <SidebarSubMenu route={route} key={route.name} />
//           ) : (
//             <li className="relative" key={route.name}>
//               {route?.outside ? (
//                 <a
//                   href={process.env.REACT_APP_STORE_DOMAIN}
//                   target="_blank"
//                   className="px-6 py-4 inline-flex items-center cursor-pointer w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
//                   rel="noreferrer"
//                 >
//                   <Route path={route.path} exact={route.exact}>
//                     <span
//                       className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
//                       aria-hidden="true"
//                     ></span>
//                   </Route>
//                   <route.icon className="w-5 h-5" aria-hidden="true" />
//                   <span className="ml-4">{t(`${route.name}`)}</span>
//                   {/* <span className="ml-4">{route.name}</span> */}

//                 </a>
//               ) : (
//                 <NavLink
//                   exact
//                   to={route.path}
//                   target={`${route?.outside ? "_blank" : "_self"}`}
//                   className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
//                   activeClassName="text-green-500 dark:text-gray-100"
//                 >
//                   <Route path={route.path} exact={route.exact}>
//                     <span
//                       className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
//                       aria-hidden="true"
//                     ></span>
//                   </Route>
//                   <route.icon className="w-5 h-5" aria-hidden="true" />
//                   <span className="ml-4">{t(`${route.name}`)}</span>
//                 </NavLink>
//               )}
//             </li>
//           )
//         )}
//       </ul>
//       <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
//         <Button onClick={handleLogOut} size="large" className="w-full">
//           <span className="flex items-center">
//             <IoLogOutOutline className="mr-3 text-lg" />
//             <span className="text-sm">{t("LogOut")}</span>
//           </span>
//         </Button>
//       </span>
//     </div>
//   );
// };

// export default SidebarContent;



// import React, { useContext, useState } from "react";
// import { NavLink, Route } from "react-router-dom";
// import Cookies from "js-cookie";
// import { Button, WindmillContext } from "@windmill/react-ui";
// import { IoLogOutOutline } from "react-icons/io5";
// import logoDark from "assets/img/logo/logo.png";
// import logoLight from "assets/img/logo/logo.png";

// import sidebar from "routes/sidebar";
// import { AdminContext } from "context/AdminContext";
// import SidebarSubMenu from "./SidebarSubMenu";
// import { useTranslation } from "react-i18next";

// const SidebarContent = () => {
//   const { t } = useTranslation();
//   const { mode } = useContext(WindmillContext);
//   const { dispatch } = useContext(AdminContext);

//   const [activeCategory, setActiveCategory] = useState(null);

//   const handleLogOut = () => {
//     dispatch({ type: "USER_LOGOUT" });
//     Cookies.remove("adminInfo");
//   };

//   const handleCategoryClick = (categoryName) => {
//     setActiveCategory((prevCategory) =>
//       prevCategory === categoryName ? null : categoryName
//     );
//   };

//   return (
//     <div className="py-4 text-gray-500 dark:text-gray-400">
//       <a className=" text-gray-900 dark:text-gray-200" href="/dashboard">
//         {mode === "dark" ? (
//           <img src={logoLight} alt="dashtar" width="150" className="pl-6" />
//         ) : (
//           <img src={logoDark} alt="dashtar" width="160" className="pl-6" />
//         )}
//       </a>
//       <ul className="mt-8">
//         {sidebar.map((route) =>
//           route.routes ? (
//             <SidebarSubMenu
//               route={route}
//               key={route.name}
//               activeCategory={activeCategory}
//               handleCategoryClick={handleCategoryClick}
//             />
//           ) : (
//             <li className="relative" key={route.name}>
//               {route?.outside ? (
//                 <a
//                   href={process.env.REACT_APP_STORE_DOMAIN}
//                   target="_blank"
//                   className={`px-6 py-4 inline-flex items-center cursor-pointer w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200 ${route.name === activeCategory
//                     ? "text-green-500 dark:text-gray-100"
//                     : ""
//                     }`}
//                   onClick={() => handleCategoryClick(route.name)}
//                   rel="noreferrer"
//                 >
//                   <Route path={route.path} exact={route.exact}>
//                     <span
//                       className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
//                       aria-hidden="true"
//                     ></span>
//                   </Route>
//                   <route.icon className="w-5 h-5" aria-hidden="true" />
//                   <span className="ml-4">{t(`${route.name}`)}</span>
//                 </a>
//               ) : (
//                 <NavLink
//                   exact
//                   to={route.path}
//                   target={`${route?.outside ? "_blank" : "_self"}`}
//                   className={`px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200 ${route.name === activeCategory
//                     ? "text-green-500 dark:text-gray-100"
//                     : ""
//                     }`}
//                   activeClassName="text-green-500 dark:text-gray-100"
//                   onClick={() => handleCategoryClick(route.name)}
//                 >
//                   <Route path={route.path} exact={route.exact}>
//                     <span
//                       className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
//                       aria-hidden="true"
//                     ></span>
//                   </Route>
//                   <route.icon className="w-5 h-5" aria-hidden="true" />
//                   <span className="ml-4">{t(`${route.name}`)}</span>
//                 </NavLink>
//               )}
//             </li>
//           )
//         )}
//       </ul>
//       <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
//         <Button onClick={handleLogOut} size="large" className="w-full">
//           <span className="flex items-center">
//             <IoLogOutOutline className="mr-3 text-lg" />
//             <span className="text-sm">{t("LogOut")}</span>
//           </span>
//         </Button>
//       </span>
//     </div>
//   );
// };

// export default SidebarContent;




// works completely according to the tasks given for the sidebar contents and navigatings

import React, { useContext, useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { Button, WindmillContext } from "@windmill/react-ui";
import { IoLogOutOutline } from "react-icons/io5";
import logoDark from "assets/img/logo/logo.png";
import logoLight from "assets/img/logo/logo.png";

import sidebar from "routes/sidebar";
import { AdminContext } from "context/AdminContext";
import SidebarSubMenu from "./SidebarSubMenu";
import { useTranslation } from "react-i18next";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { dispatch } = useContext(AdminContext);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const initialState = {};
    sidebar.forEach(route => {
      const storedState = localStorage.getItem(route.name);
      initialState[route.name] = storedState ? JSON.parse(storedState) : false;
    });
    setOpenMenus(initialState);
  }, []);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
  };
  const toggleSubMenu = (menuName) => {
    setOpenMenus(prevState => ({
      ...prevState,
      [menuName]: !prevState[menuName]
    }));
    localStorage.setItem(menuName, JSON.stringify(!openMenus[menuName]));
    Object.keys(openMenus).forEach(key => {
      if (key !== menuName && openMenus[key]) {
        setOpenMenus(prevState => ({
          ...prevState,
          [key]: false
        }));
        localStorage.setItem(key, JSON.stringify(false));
      }
    });
  };
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className=" text-gray-900 dark:text-gray-200" href="/dashboard">
        {mode === "dark" ? (
          <img src={logoLight} alt="dashtar" width="150" className="pl-6" />
        ) : (
          <img src={logoDark} alt="dashtar" width="160" className="pl-6" />
        )}
      </a>
      <ul className="mt-8">
        {sidebar.map((route) => (
          <li className="relative" key={route.name}>
            {route.routes ? (
              <SidebarSubMenu
                key={route.name}
                route={route}
                isOpen={openMenus[route.name]}
                toggleSubMenu={toggleSubMenu}
              />
            ) : (
              <NavLink
                exact
                to={route.path}
                target={`${route?.outside ? "_blank" : "_self"}`}
                className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-green-700 dark:hover:text-gray-200"
                activeClassName="text-green-500 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <route.icon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-4">{t(`${route.name}`)}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
      <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
        <Button onClick={handleLogOut} size="large" className="w-full">
          <span className="flex items-center">
            <IoLogOutOutline className="mr-3 text-lg" />
            <span className="text-sm">{t("LogOut")}</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default SidebarContent;
