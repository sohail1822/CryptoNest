import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./SignIn/login";
import Signup from "./SignIn/signup";
// import Market from "./Market/Market";
import Coin from "./routes/Coin";
import Coins from "./Market/Coins";
import axios from "axios";
import Aboutus from "./aboutus/aboutus";
import React, { useState, useEffect } from 'react'
import Coin_sell from "./routes/Coin_sell";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Messages from "./Messages/Messages";
function App() {
  const [coins, setCoins] = useState([])

  const url = 'https://api.coingecko.com/api/v3/coins/'

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setCoins(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Signup />
              </>
            }
          />
          <Route
            path="/aboutus"
            element={
              <>
                <Aboutus />
              </>
            }
          />
          <Route
            path="/dashboard/sell/:coinId"
            element={
              <>
                <Coin_sell />
              </>
            }
          />
          <Route
            path="/messages"
            element={
              <>
                <Messages />
              </>
            }
          />

          <Route path='/market' element={<Coins coins={coins} />} />
          <Route path='/coin' element={<Coin />}>
            <Route path=':coinId' element={<Coin />} />
          </Route>
          
  {/* <Route path="/dashboard/sell/:id" component={<Coin_sell/>} /> */}


        </Routes>
      </Router>
    </div>
  );
}

export default App;
