import React from 'react'

import './Coins.css'

const CoinItem = (props) => {
    const price = props.coins.market_data.current_price.inr;
    return (
        <div className='coin-row'>
            <p>{props.coins.market_data.market_cap_rank}</p>
            <div className='img-symbol'>
                <img src={props.coins.image.small} alt='' />
                <p>{props.coins.symbol.toUpperCase()}</p>
            </div>
            <p>₹{(props.coins.market_data.current_price.inr).toFixed(1)}</p>
            {(props.coins.market_data.price_change_percentage_24h).toFixed(2)<0?
                <p className="coin-percent red">{(props.coins.market_data.price_change_percentage_24h).toFixed(2)}%</p>
                :
                <p className="coin-percent green">{(props.coins.market_data.price_change_percentage_24h).toFixed(2)}%</p>
            }
            <p className='hide-mobile'>₹{props.coins.market_data.total_volume.inr.toLocaleString()}</p>
            <p className='hide-mobile'>₹{props.coins.market_data.market_cap.inr.toLocaleString()}</p>
        </div>
    )
}

export default CoinItem