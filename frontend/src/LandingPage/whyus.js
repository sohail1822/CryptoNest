import React from "react";
import "./whyus.css";
import image2 from './image2.png'
import image1 from './image1.png'
const Whyus = () => {
  return (
    <div id="why-us">
      <h3
        style={{
          textAlign: "center",
          marginTop: "10vh",
          color: " rgba(33, 150, 243, 1)",
        }}
      >
        why choose us ?
      </h3>
      <h1 style={{ textAlign: "center", marginTop: "4vh" }}>
        Specially designed for stock market
      </h1>
      <div className="batman-box">
      <div className="carder">
        <div className="card__image">
          <img src="https://images.unsplash.com/photo-1521139869420-edaae1bc7b9a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" />
        </div>
        <div className="card__copy">
          <h1>Robin Hood's Bay</h1>
          <h2>27 October, Noon.</h2>
          <p>
            --Most strange; no news yet of the ship we wait for. Mrs. Harker
            reported last night and this morning as usual: "lapping waves and
            rushing water," though she added that "the waves were very faint."
            The telegrams from London have been the same: "no further report."
            Van Helsing is terribly anxious, and told me just now that he fears
            the Count is escaping us. He added significantly:--
          </p>
        </div>
      </div>
        <div className="carder">
          <div className="card__image">
            <img src="https://images.unsplash.com/photo-1521139869420-edaae1bc7b9a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" />
          </div>
          <div className="card__copy">
            <h1>Robin Hood's Bay</h1>
            <h2>27 October, Noon.</h2>
            <p>
              --Most strange; no news yet of the ship we wait for. Mrs. Harker
              reported last night and this morning as usual: "lapping waves and
              rushing water," though she added that "the waves were very faint."
              The telegrams from London have been the same: "no further report."
              Van Helsing is terribly anxious, and told me just now that he fears
              the Count is escaping us. He added significantly:--
            </p>
          </div>
        </div>
        <div className="carder">
          <div className="card__image">
            <img src="https://images.unsplash.com/photo-1521139869420-edaae1bc7b9a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ" />
          </div>
          <div className="card__copy">
            <h1>Robin Hood's Bay</h1>
            <h2>27 October, Noon.</h2>
            <p>
              --Most strange; no news yet of the ship we wait for. Mrs. Harker
              reported last night and this morning as usual: "lapping waves and
              rushing water," though she added that "the waves were very faint."
              The telegrams from London have been the same: "no further report."
              Van Helsing is terribly anxious, and told me just now that he fears
              the Count is escaping us. He added significantly:--
            </p>
          </div>
        </div>

      </div>
      <div>
        <div className="features">
          <div className="  ourfeature-image1">
            {" "}
            <img src={image1} />
          </div>
          <div className=" ourfeature-content1">
            <h2 style={{ color: " rgba(33, 150, 243, 1)", }}>our features</h2>
            <h1 style={{ fontSize: "2vw", margin: "10px 0px" }}>Receive update market<br />
              quickly everytime</h1>

            <p>
              Equipped with comprehensive analysis tools and Artificial
              Intelligent, it makes it easier and gives you a profitable
              experience in the form of market updates quickly everytime, so it
              is not too late to make the best investment decisions.
            </p>
            <button className="banner-b122">get started</button>

          </div>
        </div>
        <div className="features">
          <div className="  ourfeature-content1">
            {" "}
            <h2 style={{ color: " rgba(33, 150, 243, 1)", }}>our features</h2>
            <h1 style={{ fontSize: "2vw", margin: "10px 0px" }}>Easy Way to Invest <br />
              and Get Profit </h1>
            <p>
              Using the Tradiant Application is an easy way to invest
              and benefit, equipped with comprehensive analysis tools and Artificial Intelligent (AI) that helps automation in monitoring and transactions.            </p>
            <button className="banner-b122">get started</button>
          </div>
          <div className=" ourfeature-image1">

            <img src={image2} />

          </div>
        </div>
      </div>
    </div>

  );
};

export default Whyus;
