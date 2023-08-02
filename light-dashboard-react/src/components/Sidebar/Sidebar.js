import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";

import logo from "assets/img/reactlogo.png";

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")",
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img src={require("assets/img/reactlogo.png")} alt="..." />
            </div>
          </a>
          <a className="simple-text" href="http://www.creative-tim.com">
            Creative Tim
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect)
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
// import React from "react";
// import {
//   Box,
//   Collapse,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import {
//   ChevronLeft,
//   ChevronRightOutlined,
//   ShoppingCartOutlined,
//   ExpandMore,
//   AddCircleRounded,
//   ListAltRounded,
//   SearchRounded,
// } from "@mui/icons-material";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import FlexBetween from "./FlexBetween";

// const Sidebar = ({
//   user,
//   drawerWidth,
//   isSidebarOpen,
//   setIsSidebarOpen,
//   isNonMobile,
// }) => {
//   const { pathname } = useLocation();
//   const [active, setActive] = useState("");
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [taobaoOpen, setTaobaoOpen] = useState(false);
//   const [crawlOpen, setCrawlOpen] = useState(false);
//   const [reportlOpen, setReportlOpen] = useState(false);

//   const navItems = [
//     {
//       text: "Client Facing",
//       icon: null,
//     },
//     {
//       text: "Taobao",
//       icon: <ShoppingCartOutlined />,
//       state: taobaoOpen,
//       children: [
//         {
//           text: "Search Taobao",
//           icon: <SearchRounded />,
//           link: "taobao/search",
//         },
//         {
//           text: "Taobao List",
//           icon: <ListAltRounded />,
//           link: "taobao",
//         },
//       ],
//     },
//     {
//       text: "Crawl Tool",
//       icon: null,
//     },
//     {
//       text: "Crawl",
//       icon: <ShoppingCartOutlined />,
//       state: crawlOpen,
//       children: [
//         {
//           text: "Crawl Setting",
//           icon: <AddCircleRounded />,
//           link: "crawl/options",
//         },
//       ],
//     },
//     {
//       text: "Report",
//       icon: <ShoppingCartOutlined />,
//       state: reportlOpen,
//       children: [
//         {
//           text: "List Report",
//           icon: <ListAltRounded />,
//           link: "report",
//         },
//       ],
//     },
//   ];

//   const handleTaobaoDropDown = () => {
//     setTaobaoOpen(!taobaoOpen);
//   };
//   const handleReportDropDown = () => {
//     setReportlOpen(!reportlOpen);
//   };
//   const handleCrawlDropDown = () => {
//     setCrawlOpen(!crawlOpen);
//   };

//   useEffect(() => {
//     setActive(pathname.substring(1));
//   }, [pathname]);

//   return (
//     <Box component="nav">
//       {isSidebarOpen && (
//         <Drawer
//           open={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//           variant="persistent"
//           anchor="left"
//           sx={{
//             width: drawerWidth,
//             "& .MuiDrawer-paper": {
//               color: theme.palette.secondary[200],
//               backgroundColor: theme.palette.background.alt,
//               boxSixing: "border-box",
//               borderWidth: isNonMobile ? 0 : "2px",
//               width: drawerWidth,
//               overflowY: "scroll",
//             },
//             "& .MuiPaper-root::-webkit-scrollbar": {
//               overflowY: "scroll",
//               backgroundColor: "#3e5867",
//             },
//             "& .element::-webkit-scrollbar-thumb": {
//               backgroundColor: theme.palette.secondary[800],
//             },
//           }}
//         >
//           <Box width="100%">
//             <Box m="1.5rem 2rem 2rem 3rem">
//               <FlexBetween color={theme.palette.secondary.main}>
//                 <Box display="flex" alignItems="center" gap="0.5rem">
//                   <Typography variant="h4" fontWeight="bold">
//                     MEGASOP CRAWL DATA
//                   </Typography>
//                 </Box>
//                 {!isNonMobile && (
//                   <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//                     <ChevronLeft />
//                   </IconButton>
//                 )}
//               </FlexBetween>
//             </Box>
//             <List>
//               {navItems.map(({ text, icon, children, state }) => {
//                 if (!icon) {
//                   return (
//                     <Typography key={text} sx={{ m: "1rem 0 1rem 3rem" }}>
//                       {text}
//                     </Typography>
//                   );
//                 }
//                 const lcText = text;
//                 const childItems = children
//                   ? children.map((child) => ({
//                       text: child.text,
//                       link: child.link,
//                       active: active === child.text,
//                     }))
//                   : null;

//                 return (
//                   <List key={text}>
//                     <ListItem key={text} disablePadding>
//                       <ListItemButton
//                         onClick={() => {
//                           if (!children) {
//                             navigate(`/${lcText}`);
//                             children ? setActive("") : setActive(lcText);
//                           } else {
//                             if (text === "Taobao") {
//                               handleTaobaoDropDown();
//                             } else if (text === "Crawl") {
//                               handleCrawlDropDown();
//                             } else if (text === "Report") {
//                               handleReportDropDown();
//                             }
//                           }
//                         }}
//                         sx={{
//                           backgroundColor:
//                             active === lcText
//                               ? theme.palette.secondary[300]
//                               : "transparent",
//                           color:
//                             active === lcText
//                               ? theme.palette.primary[600]
//                               : theme.palette.secondary[100],
//                         }}
//                       >
//                         <ListItemIcon
//                           sx={{
//                             ml: "2rem",
//                             color:
//                               active === lcText
//                                 ? theme.palette.primary[600]
//                                 : theme.palette.secondary[200],
//                           }}
//                         >
//                           {icon}
//                         </ListItemIcon>
//                         <ListItemText primary={text} />
//                         {children ? <ExpandMore /> : ""}
//                         {active === lcText && (
//                           <ChevronRightOutlined sx={{ ml: "auto" }} />
//                         )}
//                       </ListItemButton>
//                     </ListItem>
//                     {childItems && (
//                       <>
//                         {childItems.map((child, index) => (
//                           <Collapse
//                             key={index}
//                             in={state}
//                             timeout="auto"
//                             unmountOnExit
//                           >
//                             <List component="div" disablePadding>
//                               <ListItemButton
//                                 onClick={() => {
//                                   setActive(child.link);
//                                   navigate(`/${child.link}`);
//                                 }}
//                                 sx={{
//                                   backgroundColor:
//                                     active === child.link
//                                       ? theme.palette.secondary[300]
//                                       : "transparent",
//                                   color:
//                                     active === child.link
//                                       ? theme.palette.primary[600]
//                                       : theme.palette.secondary[100],
//                                 }}
//                               >
//                                 <ListItemIcon sx={{ ml: "3rem" }}>
//                                   {children[index].icon}
//                                 </ListItemIcon>
//                                 <ListItemText
//                                   primary={child.text}
//                                   sx={{ ml: "-1rem" }}
//                                 />
//                               </ListItemButton>
//                             </List>
//                           </Collapse>
//                         ))}
//                       </>
//                     )}
//                   </List>
//                 );
//               })}
//             </List>
//           </Box>
//         </Drawer>
//       )}
//     </Box>
//   );
// };

// export default Sidebar;
