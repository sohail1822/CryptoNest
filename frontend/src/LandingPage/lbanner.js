import React from "react";
import "./lbanner.css";
import tradeimg from "./tradeimg.jpg";
import oracle from './oracle.png'
import samsung from './samsung.png'
import zz from './zz.png'
import segment from './segment.png'
import protnet from './protnet.png'
const Lbanner = () => {
  return (
    <>
    <div className="banner-landPage">
      <div className="banner-content">
        {/* <h3>smart investation</h3> */}
        <h1>
          Invest Your Money With Us <br />
          and Get Amazing Profit
        </h1>
        <p>
          Maximize your investment in the capital market world with the
          <br />
          convenience and various features provided by Tradiant.
        </p>
      <div className="banner-button"> 
        <button className="banner-b1">Get started</button>
        <button className="banner-b2">See how it works</button>
        </div>
      </div>
      <div className="banner-image">
        <img className="main-image1" src={tradeimg}></img>
      </div>
    </div>
    <div className="inverstors">
      <h3 style={{textAlign:"center" ,margin:"3vh", fontSize:"3vw"}}>Invest in their stock and be part of the business</h3>
      <div style={{textAlign:"center"}}>
  <div className="investor-logo"><img src={oracle} style={{width:"90px"}}></img></div>
      <div className="investor-logo"><img src={samsung} style={{width:"90px"}}></img></div>
      <div className="investor-logo"><img src={zz} style={{width:"90px"}}></img></div>
      <div className="investor-logo"><img src={protnet} style={{width:"90px"}}></img></div>
      <div className="investor-logo"><img src={segment} style={{width:"90px"}}></img></div>

    </div>
    </div>
    </>
  );
};

export default Lbanner;
