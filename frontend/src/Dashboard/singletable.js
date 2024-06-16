import "./Dashboard.css";

import React, { useState, useEffect } from "react";

function Singletable(props) {
  return (


        <tbody style={{width:"100vw"}}>
              <tr >
                <td>{props.stockId}</td>
                {/* <td>{Math.round(Math.random()*10000+1)}</td> */}
                <td>{Math.round(props.total_amount)}</td>
                <td className="war" style={{color:"green"}}>Completed</td>
                <td className="primary">Details</td>
              </tr>
        </tbody>
  );
}

export default Singletable;
