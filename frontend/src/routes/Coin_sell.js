
import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import "./Coin.css";
// import GAChart from "../chart/graph";
// import axios from 'axios'
// import { useParams } from 'react-router-dom'
// import React, { useState, useEffect } from 'react'
// import DOMPurify from 'dompurify'
// import {toast} from 'react-toastify'
// import './Coin.css'
// import GAChart from '../chart/graph'
import { useLocation } from "react-router-dom";

const Coin_sell = () => {
  const params = useParams();
  const location = useLocation();
  console.log(location.state);
  const [coin, setCoin] = useState({});
  const [value, setValue] = useState();
  const [avl,setAvl] = useState(0);
  const [quantity,setQuantity] = useState(0);
  const [message,ShowMessage] = useState(0);
  
  let bitcoin = "bitcoin"
  useEffect(() => {
    setQuantity(location.state.quantity);
    var x = quantity * coin.market_data?.current_price.inr;
    setAvl(x);
  }, [coin]);
  
  const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`
    useEffect(() => {
        axios.get(url).then((res) => {
            setCoin(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    const handleBuy = (e) => {
        e.preventDefault();
        console.log("Going To Sell",value);
        if(value > avl){
          ShowMessage(1);
          return;
        }
        if(value<10){
          ShowMessage(2);
          return;
        }
        console.log(coin.market_data?.current_price.inr);
        if(!value){
            toast.error("Please Enter Amount");
            console.log("Please Enter Amount");
            return;
        }
        const userId = localStorage.getItem("userId");
        console.log(userId);
        fetch("https://crytotrade-app.onrender.com/api/user/stock/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            userId: userId,
            stockId: coin.id,
            quantity: value / coin.market_data?.current_price.inr,
            current_price: value,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            // if (response.status === 200) {
            //   toast.success("Stock Bought Successfully");
            //   console.log(response);
            // } else {
            //   toast.error("Please try again later");
            // }
            if (response.success) {
              toast.success("Stock Sold Successfully");
              console.log(response);
              setAvl(response.data.amount_left);
              // setQuantity(response.data.quan)
              setQuantity(
                quantity - value / coin.market_data?.current_price.inr
              );
              setTimeout(() => {
                window.location.href = "/dashboard";
              }, 2000);
            } else {
              toast.error("Please try again later");
            }
          });
    }
    useEffect(() => {
      if(value > avl){
        ShowMessage(1);
        return;
      }else if(value<10){
        ShowMessage(2);
      }
      else{
        ShowMessage(0);
      }
    }, [value]);
    return (
      <div>
        <div className="coin-container">
          <div className="content">
            <div className="coin_name flex flex-row justify-between">
              <h1>{coin.name}</h1>
              <p>
                Available To Sell :{" "}
                {Math.round((avl + Number.EPSILON) * 100) / 100}
              </p>
            </div>
            {message==1 ? (
              <p className="text-red-500">
                You Have Only {coin.name}s of value{" "}
                {Math.round((avl + Number.EPSILON) * 100) / 100} to sell
              </p>
            ) : null}
            {message==2 ? (
              <p className="text-red-500">
                You Can Only Sell Minimum Amount of 10Rs
              </p>
            ) : null}

            <div className="btn-store">
              <h2>Amount:</h2>
              <div className="buy-amount">
                <form>
                  <input
                    type="number"
                    placeholder="Stock"
                    // value={value}
                    min="1"
                    max="2000"
                    step="50"
                    defaultValue="0"
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <input
                    className="btn-sell"
                    type="submit"
                    value="Sell"
                    style={{ border: "1px green" }}
                    onClick={handleBuy}
                  />
                </form>
              </div>

              {/* <button className='btn-buy'>Buy</button> */}
              {/* <button className='btn-sell'>Sell</button> */}
            </div>
          </div>
          <div className="content">
            <div className="rank">
              <span className="rank-btn">Rank # {coin.market_cap_rank}</span>
            </div>
            <div className="info">
              <div className="coin-heading">
                {coin.image ? <img src={coin.image.small} alt="" /> : null}
                <p>{coin.name}</p>
                {coin.symbol ? <p>{coin.symbol.toUpperCase()}/INR</p> : null}
              </div>
              <div className="coin-price">
                {coin.market_data?.current_price ? (
                  <h1>
                    Rs{" "}
                    {coin.market_data.current_price.inr
                      .toFixed(1)
                      .toLocaleString()}
                  </h1>
                ) : null}
              </div>
            </div>
          </div>

          <div className="content">
            <table>
              <thead>
                <tr>
                  <th>1h</th>
                  <th>24h</th>
                  <th>7d</th>
                  <th>14d</th>
                  <th>30d</th>
                  <th>1yr</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_1h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_1h_in_currency.inr.toFixed(
                          1
                        )}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_24h_in_currency.inr.toFixed(
                          1
                        )}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_7d_in_currency.inr.toFixed(
                          1
                        )}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_14d_in_currency.inr.toFixed(
                          1
                        )}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_30d_in_currency.inr.toFixed(
                          1
                        )}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_1y_in_currency.inr.toFixed(
                          1
                        )}
                        %
                      </p>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="content">
            <div className="stats">
              <div className="left">
                <div className="row">
                  <h4>24 Hour Low</h4>
                  {coin.market_data?.low_24h ? (
                    <p>Rs {coin.market_data.low_24h.inr.toLocaleString()}</p>
                  ) : null}
                </div>
                <div className="row">
                  <h4>24 Hour High</h4>
                  {coin.market_data?.high_24h ? (
                    <p>
                      Rs{" "}
                      {coin.market_data.high_24h.inr
                        .toFixed(1)
                        .toLocaleString()}
                    </p>
                  ) : null}{" "}
                </div>
              </div>
              <div className="right">
                <div className="row">
                  <h4>Market Cap</h4>
                  {coin.market_data?.market_cap ? (
                    <p>Rs {coin.market_data.market_cap.inr.toLocaleString()}</p>
                  ) : null}
                </div>
                <div className="row">
                  <h4>Circulating Supply</h4>
                  {coin.market_data ? (
                    <p>{coin.market_data.circulating_supply}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="about">
              <h3>About</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    coin.description ? coin.description.en : ""
                  ),
                }}
              ></p>
            </div>
          </div>
          {/* <div className="graph">
          <GAChart />
        </div> */}
        </div>
      </div>
    );
};

export default Coin_sell;
