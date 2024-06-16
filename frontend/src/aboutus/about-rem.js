import React from 'react';
import './about-rem.css';
import i1 from "./i1.png"
import im1 from "./im1.png"
import i2 from "./i2.png"
import im2 from "./im2.png"
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const Aboutrem = () => {
  return (
    <div className='aboutrem'>
      <div className='about-content'
        data-aos="zoom-out"
        data-aos-anchor-placement="top-center"
        // data-aos-offset="300"
        data-aos-delay="50"
        data-aos-easing="ease-in-out"
        data-aos-duration="1000">
        <h1 style={{ textAlign: "center", fontSize: "300%" }}>A trading partner you can trust</h1>
        <p style={{ textAlign: "center", fontSize: "150%" }}>At Tradiant, we rigorously focus on quality and transparency. Our order execution quality is independently monitored. Order execution with high quality means: you save money with every investment you make with Tradiant.</p>

      </div>
      <div className="batman-boxabout">
        <div className="carderabout"
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
          // data-aos-offset="300"
          data-aos-delay="50"
          data-aos-easing="ease-in-out"
          data-aos-duration="1000">
          <div className="card__imageabout">
            <img src={i1} />
          </div>
          <div className="card__copy">
            <h1>Quality execution on every trade</h1>
            <p>
              Backed by multiple analyzes and precise algorithms providing quality execution decisions on every trade. Guarantee your comfort and perfection in making decisions.          </p>
          </div>
        </div>
        <div className="carderabout"
          data-aos="fade-down"
          data-aos-anchor-placement="top-center"
          // data-aos-offset="300"
          data-aos-delay="50"
          data-aos-easing="ease-in-out"
          data-aos-duration="1000">
          <div className="card__imageabout">
            <img src={i2} />
          </div>
          <div className="card__copyabout">
            <h1>Transparent & competitive pricing</h1>
            <p>
              Provides transparency Pricing Emphasizes Value, not Price. As price becomes clearer to everyone in the market, each competitor's value also comes into sharper focus.            </p>
          </div>
        </div>
      </div>





      <div className="batman-boxabout">
        <div className="carderabout"
          data-aos="flip-left"
          data-aos-anchor-placement="top-center"
          // data-aos-offset="300"
          data-aos-delay="50"
          data-aos-easing="ease-in"
          data-aos-duration="600">
          <div className="card__imageabout">
            <img src={im1} />
          </div>
        </div>
        <div className="carderabout"
        >
          <div className="card__copyabout"
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            // data-aos-offset="300"
            data-aos-delay="50"
            data-aos-easing="ease-in-out"
            data-aos-duration="800"
          >
            <h1 style={{ padding: "30px" }}>Our Vision</h1>
            <p style={{ padding: "30px" }}>
              Our vision is to become a trusted advisor, intermediary, and partner to assist customers in determining financial strategies in the capital market and Become a professional reinsurance broker with a global reputation </p>
          </div>
        </div>
      </div>



      <div className="batman-boxabout">
        <div className="carderabout"
          data-aos="fade-down"
          data-aos-anchor-placement="top-center"
          // data-aos-offset="300"
          data-aos-delay="50"
          data-aos-easing="ease-in-out"
          data-aos-duration="800"
        >
          <div className="card__copy">
            <h1 style={{ padding: "30px" }}>Our Mission</h1>
            <p style={{ padding: "30px" }}>
              Providing excellent service from risk placement to settlement of compensation in the interest of obtaining the best capital market results. Maintain the profitability of each user with the aim of meeting the expectations of each user</p>
          </div>
        </div>
        <div className="carderabout"
          data-aos="flip-right"
          data-aos-anchor-placement="top-center"
          // data-aos-offset="300"
          data-aos-delay="50"
          data-aos-easing="ease-in"
          data-aos-duration="600">
          <div className="card__imageabout">
            <img src={im2} />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}
      data-aos="fade"
          data-aos-anchor-placement="top-center"
          // data-aos-offset="300"
          data-aos-delay="50"
          data-aos-easing="ease-in-out"
          data-aos-duration="800">
        <h1 style={{ textAlign: "center", fontSize: "3vw" }}>All of this and much more dedicated from <strong style={{ color: " #7380ec" }}>HackElites</strong> to your success</h1>
        <button className="banner-b1234">Trade with us</button>
      </div>
    </div>

  );
};

export default Aboutrem;
