import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import axios from "axios";
import "./Messages.css";
import Navbar from "../Navbar/Navbar";


const { Meta } = Card;

// npx create-react-app appname
// npm i antd
// npm i axios
// b6e122bd0949cec51cc51a7be64de685b821347f

function Messages() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const response = await axios.get(
        "https://gnews.io/api/v4/search?q=crypto&apikey=c7fd4e0ff18f821f40e99a86f732b6ad"
      );
      setNews(response.data.articles);
      console.log("news_is", response.data.articles)
    };
    loadNews();
  }, []);

  console.log("news", news);

  return (
    <div className="container9">


      <div className="navbar-area">
        <Navbar />
      </div>
      <div className="Messages">
        <h1 className="news_heading">News Updates</h1>

        {news.filter(new_img => new_img.image != null).map((item, index) => {
          return (
            <Card
              key={index}
              hoverable
              className="card_news"
              cover={<img alt="image" src={item.image} />}
            >
              <Meta title={item.title} description={item.description} />
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Button style={{ marginTop: "10px" }}>
                  Read More
                </Button>
              </a>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;