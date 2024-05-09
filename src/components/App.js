import React from "react";
import MainSection from "./MainSection/MainSection";
import AboutPage from "./AboutPage";
import ErrorPage from "./ErrorPage";
import RedirectPage from "./RedirectPage";
import LogoutPage from "./LogoutPage";
import "./App.scss";
import { Route, BrowserRouter as Router, Navigate, Routes } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  return (
    <div className="container-fluid">

      <CssBaseline />
      {/* <Header /> */}
      {/* <Switch> */}
      <Router basename="/otcsemails/">
        <Routes>
        <Route path="/browser"  element={<MainSection />} />
        {/* <Redirect exact from="/" to="browser" /> */}
        <Route path="/" element={<Navigate to={"/browser"} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/logout"  element={<LogoutPage />} />
        </Routes>
        </Router>
        {/* <Route path="/courses" component={CoursesPage} />
        
        <Route path="/course/:slug" component={ManageCoursePage} />
        
        <Route component={NotFoundPage} /> */}
      {/* </Switch> */}

    </div>
  );
}

export default App;
