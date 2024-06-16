import React from "react";
import "./chart.css";
import Chart from "react-apexcharts";
import axios from "axios";
import { useEffect, useState } from "react";

const GAChart = (props) => {
  const [data, setdata] = useState([]);
  // const [arr,setarr]
  let arr = [];
  var day = Number(Math.random() * 10 + 1);
  useEffect(() => {
    // var newUser = { name: 'Ankur Agrawal', email: 'ankur.agrawal.ece20@itbhu.ac.in', college: 'IIT BHU', year: 'Part III', phone: '1234567890', referral: 'default#EES-10000', radianite_points: 0, token: 'd221d7afdf288fc097ff321d77154de4b3b6a24e' };
    // window.sessionStorage.setItem('profileData', newUser);
    //     axios
    //       .get('https://ees23.pythonanywhere.com/api/teams/user/', { headers: { Authorization: 'Token ' + newUser.token } })
    //       .then((res) => {
    //         console.log(res);
    //         setTeamData(res.data);
    //         axios
    //           .get('https://ees23.pythonanywhere.com/api/events/')
    //           .then((res) => {
    //             console.log(res);
    //             let arr = [];
    //             for (let i = 0; i < res.data.length; i++) {
    //               // for (!teamData.includes(res.data[i])) {
    //               // }
    //               let mark = 0;
    //               for (let j = 0; j < teamData.length; j++) {
    //                 if (teamData[j].event == res.data[i].event) {
    //                   mark = 1;
    //                 }
    //               }
    //               if (mark == 0) {
    //                 arr.push(res.data[i]);
    //               }
    //             }
    //             console.log(arr);
    //             setEventsData(arr);

    //             // console.log(eventsData);
    //           })
    //           .catch((error) => console.log(error));

    //         // console.log(teamData);
    //       })
    //       .catch((error) => console.log(error));
    //     console.log('uuse');
    //   }, [teamData]);
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': 'eb4e760030mshd131a038e7f942fp1bf55ejsn02b7f392f922',
    //         'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
    //     }
    // };

    // fetch('https://alpha-vantage.p.rapidapi.com/query?function=DIGITAL_CURRENCY_MONTHLY&market=CNY&symbol=BTC', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));

    // let day=Number(Math.random()*20);
    // console.log(day);

    const func = async () => {
      const url = `https://api.coingecko.com/api/v3/exchanges/binance/volume_chart?days=${Math.ceil(day)}`;
      const response = await fetch(url);
      const parseData = await response.json();
      // setdata(parseData["Time Series (5min)"]);
      // console.log(parseData["Time Series (5min)"]);
      // console.log(parseData);
      for (let i = 1; i < parseData.length && i < 50; i++) {
        arr.push(Math.round(parseData[i][1]));
      }
      // for (const [key, value] of Object.entries(
      //   parseData["Monthly Time Series"]
      // )) {
      //   console.log(`${key}: ${value}`);
      //   let year = Number(key.split("-")[0]);
      //   let month = Number(key.split("-")[1]);
      //   let day = Number(key.split("-")[2]);
      //   console.log(month);
      //   let temp = [];
      //   for (const [key2, value2] of Object.entries(value)) {
      //     if (temp.length < 4) {
      //       temp.push(value2);
      //     }
      //   }
      //   let person3 = { x: key, y: temp };

      //   console.log(temp);
      //   arr.push(person3);
      setdata(arr);
      // }
    };
    func();
  }, []);

  return (
    <div>
      {/* <Chart
        type="candlestick"
        width={800}
        height={400}
        series={[
          {
            data: data.slice(1,30),
          },
        ]}
        options={{

          title: { text: "Token Allocation" },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#3C90EB",
                downward: "#DF7D46",
              },
            },
          },


        }}
      /> */}
      <Chart
        type="line"
        width={800}
        height={400}
        series={[
          {
            name: "product",
            data: data,
          },
        ]}
        options={{
          title: { text: "Token Allocation" },
          // plotOptions: {
          //   candlestick: {
          //     colors: {
          //       upward: "#3C90EB",
          //       downward: "#DF7D46",
          //     },
          //   },
          // },
          xaxis: {
            title: { text: "production sell for today (volumes)" },
            // categories:['1','2','3','4','5','6']
          },
        }}
      />
    </div>
  );
};

export default GAChart;
