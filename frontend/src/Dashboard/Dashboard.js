import React, { useEffect, useState } from "react";
import "./Dashboard.css";
// import logo from '../assets/logo.png'

import profile1 from "../assets/profile-1.jpg";
import profile2 from "../assets/profile-2.jpg";
import profile3 from "../assets/profile-3.jpg";
import profile4 from "../assets/profile-4.jpg";
import Navbar from "../Navbar/Navbar";
import { redirect } from "react-router-dom";

import axios from "axios";
import Single from "./singlediv";
import { setConfig } from "dompurify";

import { toast } from "react-toastify";
import DataStats from "../DataStats/DataStats";
import Singletable from "./singletable";
import AChart from "../chart/chart";

function RenderingArrayOfObjects(props) {
  const [currentcoins, setcurrentcoins] = useState([]);
  const [listItems, setlistItems] = useState([]);


  const getdata = () => {
    const token = localStorage.getItem("token");
    var userId = localStorage.getItem("userId");
    console.log(userId);
    userId = userId.replace(/['"]+/g, "");
    console.log(userId);
    fetch("https://crytotrade-app.onrender.com/api/user/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log(res);
        let newarr = [];
        // console.log("hi");
        // setbalance(Math.round(res.data.credits))
        res = res.data.stocks;
        for (let i = 0; i < res.length; i++) {
          const url = `https://api.coingecko.com/api/v3/coins/${res[i].stockId}`;

          axios
            .get(url)
            .then((resa) => {
              res[i].imagesmall = resa.data.image.small;
              res[i].current_market_price =
                resa.data.market_data.current_price.inr;
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // console.log(res);
        return res;
      })
      .then((res) => {
        // showdata(res)
        setcurrentcoins(res);
      })
      .then(() => {
        return showdata(currentcoins);
      })
      .then((lists) => {
        setlistItems(lists);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };
  //   getdata();
  useEffect(() => {
    getdata();
  }, [currentcoins]);

  // const data = {currentcoins};
  // console.log(data);
  // let listItems=[];
  const showdata = (datas) => {
    let listItems1 = datas.map((element) => {
      return (
        <Single
          key={element.sto}
          stockId={element.stockId}
          imagesmall={element.imagesmall}
          total_amount={element.total_amount}
          quantity={element.quantity}
          current_market_price={element.current_market_price}
          current_cost={element.quantity * element.current_market_price}
        />
      );
    });
    return listItems1;
  };

  return <div>{listItems}</div>;
}
function RenderingArrayOfLists(props) {
  const [currentcoins, setcurrentcoins] = useState([]);
  const [listItems, setlistItems] = useState([]);

  const getdata = () => {
    const token = localStorage.getItem("token");
    var userId = localStorage.getItem("userId");
    console.log(userId);
    userId = userId.replace(/['"]+/g, "");
    console.log(userId);
    fetch("https://crytotrade-app.onrender.com/api/user/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        let newarr = [];
        res = res.data.stocks;
        for (let i = 0; i < res.length; i++) {
          const url = `https://api.coingecko.com/api/v3/coins/${res[i].stockId}`;

          axios
            .get(url)
            .then((resa) => {
              res[i].imagesmall = resa.data.image.small;
              res[i].current_market_price =
                resa.data.market_data.current_price.inr;
            })
            .catch((error) => {
              console.log(error);
            });
        }
        console.log(res);
        return res;
      })
      .then((res) => {
        // showdata(res)
        setcurrentcoins(res);
      })
      .then(() => {
        return showdata(currentcoins);
      })
      .then((lists) => {
        setlistItems(lists);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };
  //   getdata();
  useEffect(() => {
    getdata();
  }, []);

  const showdata = (datas) => {
    console.log("showdata");
    console.log(datas);
    let listItems1 = datas.map((element) => { 
      return (
        <Singletable
          key={element.sto}
          stockId={element.stockId}
          imagesmall={element.imagesmall}
          total_amount={element.total_amount}
          quantity={element.quantity}
          current_market_price={element.current_market_price}
          current_cost={element.quantity * element.current_market_price}
        />
      );
    });
    return listItems1;
  };

  return <>{listItems}</>;
}

const Dashboard = () => {
  const [name, setName] = React.useState("Admin");

  const [balance, setbalance] = useState(0);
  const [investment, setinvestment] = useState(0);
  const [temp, settemp] = useState(0);
  // change theme
  function changeColor() {
    document.body.classList.toggle("dark-theme-variables");
    document.querySelector(".light-btn").classList.toggle("active");
    document.querySelector(".dark-btn").classList.toggle("active");
  }
 

  const getdata = () => {
    const token = localStorage.getItem("token");
    var userId = localStorage.getItem("userId");
    console.log(userId);
    userId = userId.replace(/['"]+/g, "");
    console.log(userId);
    fetch("https://crytotrade-app.onrender.com/api/user/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        let newarr = [];
        console.log("hi");
        setbalance(Math.round(res.data.credits));

        res = res.data.stocks;
        let dummy = 0;
        for (let i = 0; i < res.length; i++) {
          const url = `https://api.coingecko.com/api/v3/coins/${res[i].stockId}`;

          axios
            .get(url)
            .then((resa) => {
              res[i].imagesmall = resa.data.image.small;
              res[i].current_market_price =
                resa.data.market_data.current_price.inr;
              dummy +=
                res[i].quantity * resa.data.market_data.current_price.inr;
              console.log(dummy);
              settemp(Math.round(dummy));
            })
            .catch((error) => {
              console.log(error);
            });

          // console.log(res[i].quantity);
        }
        // setinvestment(Math.round(temp));
        console.log(dummy);
        // setinvestment(temp)
        return temp;
      })
      .then((temp) => {
        setinvestment(temp);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };
  //   getdata();
  useEffect(() => {
    getdata();
  }, []);

  // const currentdata=(coinobj,id,index)=>{
  //   const url = `https://api.coingecko.com/api/v3/coins/${id}`;

  //         axios.get(url).then((res) => {
  //             let dummy=coinobj;
  //             dummy.imagesmall=res.data.image.small;
  //             dummy.current_market_price=res.data.market_data.current_price.inr;

  //             console.log(dummy);
  //             return dummy;
  //             // setCoin(res.data)
  //         }).catch((error) => {
  //             console.log(error)
  //         })

  // }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
    }
    console.log(localStorage.getItem("token"));
    const name = window.localStorage.getItem("first_name");
    console.log(name);
    setName(name);
  }, []);

  return (
    <div className="container1">
      <div className="navbar-area">
        <Navbar />
      </div>

      {/* <!-------------  END OF ASIDE  ----------> */}
      <main>
        <h1>DashBoard</h1>

        <div className="insights">
          {/* 
          <div className="sales">
            <img src={currentcoins[0].imagesmall}></img>
            <span className="material-icons-sharp">analytics</span>

            <div className="middle">
              <div className="left">
                <h3>{currentcoins[0].stockId}</h3>
                <h1>Rs {currentcoins[0].total_amount}</h1>
                <h1>Rs {currentcoins[0].current_market_price}</h1>
              </div>
              <div className="progress">
        
                <img src={currentcoins[0].imagesmall}></img>
                <div className="number">
                  <p>81%</p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
 */}

          <div className="sales">
            <span className="material-icons-sharp">analytics</span>
            <div className="middle">
              <div className="left">
                <h3>Balance Remaining</h3>
                <h1>₹{balance}</h1>
              </div>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>{(balance / 10000).toFixed(2)} %</p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
          {/* <!-- END OF SALES --> */}
          <div className="expenses">
            <span className="material-icons-sharp">bar_chart</span>
            <div className="middle">
              <div className="left">
                <h3>Total Investment</h3>
                <h1>₹{1000000 - balance}</h1>
              </div>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                % investments
                <div className="number">
                  <p> {((1000000 - balance) / balance).toFixed(2)}%</p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
          {/* <!-- END OF EXPENSES --> */}
          <div className="income">
            <span className="material-icons-sharp">stacked_line_chart</span>
            <div className="middle">
              <div className="left">
                <h3>Current Price</h3>
                <h1>₹{temp}</h1>
              </div>
              {/* <p>
                 {((temp / (1000000 - balance)) * 100).toFixed(2)}%
                </p> */}
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                {(((temp / (1000000 - balance)) * 100 - 100).toFixed(2) >= 0) ? "% Profits" : "%Loss"}
                <div className="number">
                  <p>
                    {((temp / (1000000 - balance)) * 100 - 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <small className="text-muted">Last 24 Hours</small>
          </div>
          {/* <!-- END OF INCOME --> */}
        </div>
        {/* <!----------- Data Stats-------------> */}
        <h2>Recent Coins</h2>
        {/* <DataStats/> */}
        <RenderingArrayOfObjects />
        {/* <RenderingArrayOfObjects /> */}

        {/* <!----------- END OF INSIGHTS -------------> */}

        <div className="orders">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Number</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <RenderingArrayOfLists />
            {/* <tbody>
              <tr>
                <td>Foldable Mini Drone</td>
                <td>81641</td>
                <td>Due</td>
                <td className="war">Pending</td>
                <td className="primary">Details</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>Foldable Mini Drone</td>
                <td>69001</td>
                <td>Due</td>
                <td className="war">Pending</td>
                <td className="primary">Details</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>Foldable Mini Drone</td>
                <td>12346</td>
                <td>Due</td>
                <td className="war">Pending</td>
                <td className="primary">Details</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>Foldable Mini Drone</td>
                <td>52921</td>
                <td>Due</td>
                <td className="war">Pending</td>
                <td className="primary">Details</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>Foldable Mini Drone</td>
                <td>33911</td>
                <td>Due</td>
                <td className="war">Pending</td>
                <td className="primary">Details</td>
              </tr>
            </tbody> */}
          </table>
          <a href="#">Show All</a>
        </div>
      </main>
      {/* <!---------------- END OF MAIN -----------> */}

      <div className="right">
        <div className="top">
          <button id="menu-btn">
            <span className="material-icons-sharp">menu</span>
          </button>
          <div className="theme-toggler" onClick={changeColor}>
            <span className="material-icons-sharp light-btn active" >
              light_mode
            </span>
            <span className="material-icons-sharp dark-btn">dark_mode</span>
          </div>
          <div className="profile">
            <div className="info">
              <p>
                Hey, <b>{name}</b>
              </p>
              <small className="text-muted" style={{ margin: "auto" }}>
                Admin
              </small>
            </div>
            <div className="profile-photo">
              <img src={profile1} alt="hero" />
            </div>
          </div>
        </div>
        {/* <!----------- END OF TOP -----------> */}
        <div className="recent-updates">
          <h2>Recent Updates</h2>
          <div className="updates">
            <div className="update">
              <div className="profile-photo">
                <img src={profile2} alt="hero" />
              </div>
              <div className="message">
                <p>
                  <b>
                    Mike <b>Crypto Faces a Banking Crisis. For Some, It’s a Conspiracy</b>
                  </b>
                </p>
                <small className="text-muted">2 Minutes Ago</small>
              </div>
            </div>
            <div className="update">
              <div className="profile-photo">
                <img src={profile3} alt="hero" />
              </div>
              <div className="message">
                <p>
                  <b>
                    Rhea <b>Biden Budget Plan Would Close Crypto Tax Loss Harvesting Loophole </b>
                  </b>
                </p>
                <small className="text-muted">3 Minutes Ago</small>
              </div>
            </div>
            <div className="update">
              <div className="profile-photo">
                <img src={profile4} alt="hero" />
              </div>
              <div className="message">
                <p>
                  <b>
                    Zoya <b>More pain for the crypto industry means a chance for startups to pivot</b>
                  </b>
                </p>
                <small className="text-muted">5 Minutes Ago</small>
              </div>
            </div>
          </div>
          {/* <!----------- END OF RECENT UPDATES -------> */}
          <div style={{ marginTop: "10px" }} >
            <AChart />
          </div>

          {/* <div className="sales-analytics">
            <h2>Sales Analytics</h2>

            <div className="item online">
              <div className="icon">
                <span className="material-icons-sharp">shopping_cart</span>
              </div>
              <div className="right">
                <div className="info">
                  <h3>ONLINE ORDERS</h3>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <div>
                  <h5 className="success">55%</h5>
                  <h3>2432</h3>
                </div>
              </div>
            </div>
            <div className="item offline">
              <div className="icon">
                <span className="material-icons-sharp">local_mall</span>
              </div>
              <div className="right">
                <div className="info">
                  <h3>OFFLINE ORDERS</h3>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <div>
                  <h5 className="danger">-15%</h5>
                  <h3>781</h3>
                </div>
              </div>
            </div>
            <div className="item customers">
              <div className="icon">
                <span className="material-icons-sharp">person</span>
              </div>
              <div className="right">
                <div className="info">
                  <h3>NEW CUSTOMERS</h3>
                  <small className="text-muted">Last 24 Hours</small>
                </div>
                <div>
                  <h5 className="success">+25%</h5>
                  <h3>1822</h3>
                </div>
              </div>
            </div>

            <div className="item" id="add_product">
              <div>
                <span className="material-icons-sharp">add</span>
                <h3>Add Product</h3>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
