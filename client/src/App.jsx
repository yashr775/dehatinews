import { lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ReactGA from "react-ga4";
import Protectedroute from "./components/Protectedroute.jsx";
import Layout from "./components/Layout.jsx"; // Import the Layout component
import NotificationSetup from "./components/NotificationSetup";


const Home = lazy(() => import("./pages/Home.jsx"));
const Signin = lazy(() => import("./pages/Signin.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Createpost = lazy(() => import("./pages/CreatePost.jsx"));
const Local = lazy(() => import("./pages/Local.jsx"));
const Viewfull = lazy(() => import("./pages/Viewfull.jsx"));
const Update = lazy(() => import("./pages/Update.jsx"));
const Download = lazy(() => import("./pages/Download.jsx"));
const Contactus = lazy(() => import("./pages/Contactus.jsx"));
const SponsorsTable = lazy(() => import("./pages/SponsorsTable.jsx"));
const Createsponsor = lazy(() => import("./pages/Createsponsors.jsx"));
const Worldnews = lazy(() => import("./pages/Worldnews.jsx"));
const Advertisement = lazy(() => import("./pages/Advertisement.jsx"));
const Analyticspage = lazy(() => import("./pages/Analytics.jsx"))

ReactGA.initialize(import.meta.env.VITE_GOOGLEID);

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send("pageview", location.pathname);
  }, [location]);

  return null;
};

const App = () => {

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }

  return (
    <Router>
    <NotificationSetup />
      <Analytics />
      <Routes>
        {/* Public Pages */}
        <Route
          path="/"
          element={
            <Layout title="Dehaat News">
              <Local />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout title="Home - Dehaat News">
              <Home />
            </Layout>
          }
        />
        <Route
          path="/signin"
          element={
            <Layout title="Sign In - Dehaat News">
              <Signin />
            </Layout>
          }
        />
        <Route
          path="/local"
          element={
            <Layout title="Local News - Dehaat News">
              <Local />
            </Layout>
          }
        />
        <Route
          path="/contactus"
          element={
            <Layout title="Contact Us - Dehaat News">
              <Contactus />
            </Layout>
          }
        />
        <Route
          path="/download"
          element={
            <Layout title="Download - Dehaat News">
              <Download />
            </Layout>
          }
        />
        <Route
          path="/viewfull/:id"
          element={
            <Layout title="View Full News - Dehaat News">
              <Viewfull />
            </Layout>
          }
        />
        <Route
          path="/worldNews"
          element={
            <Layout title="World News - Dehaat News">
              <Worldnews />
            </Layout>
          }
        />
        <Route
          path="/advertisement"
          element={
            <Layout title="World News - Dehaat News">
              <Advertisement />
            </Layout>
          }
        />

        {/* Protected Routes (Only for Admins) */}
        <Route path="" element={<Protectedroute />}>
          <Route
            path="/admin"
            element={
              <Layout title="Admin Panel - Dehaat News">
                <Admin />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout title="Analytics Data - Dehaat News">
                <Analyticspage />
              </Layout>
            }
          />
          <Route
            path="/createPost"
            element={
              <Layout title="Create Post - Dehaat News">
                <Createpost />
              </Layout>
            }
          />
          <Route
            path="/update/:id"
            element={
              <Layout title="Update Post - Dehaat News">
                <Update />
              </Layout>
            }
          />
          <Route
            path="/sponsors"
            element={
              <Layout title="Sponsors - Dehaat News">
                <SponsorsTable />
              </Layout>
            }
          />
          <Route
            path="/createSponsors"
            element={
              <Layout title="Create Sponsor - Dehaat News">
                <Createsponsor />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};


export default App;
