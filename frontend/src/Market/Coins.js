import React from 'react'
import CoinItem from './CoinItem'
import Coin from '../routes/Coin'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import './Coins.css'
import profile1 from '../assets/profile-1.jpg'
import AChart from '../chart/chart'


const Coins = (props) => {
    // change theme
    function changeColor() {
        document.body.classList.toggle("dark-theme-variables");
    }
    return (
        <div className='container3'>
            <div className="nav-show">
                <Navbar />
            </div>
            <div>
                <Link to='/'>
                    <div className='coin-search'>
                        <h1><i class="fa-solid fa-coins purple"></i> Top <span className='purple'>Coins</span></h1>
                    </div>
                </Link>
                <div className='heading'>
                    <p>#</p>
                    <p className='coin-name'>Coin</p>
                    <p>Price</p>
                    <p>24h</p>
                    <p className='hide-mobile'>Volume</p>
                    <p className='hide-mobile'>Mkt Cap</p>
                </div>

                {props.coins.map(coins => {
                    return (
                        <Link to={`/coin/${coins.id}`} element={<Coin />} key={coins.id}>
                            <CoinItem coins={coins} />
                        </Link>

                    )
                })}

            </div>
            <div className="right">
                <div className="top">
                    <button id="menu-btn">
                        <span className="material-icons-sharp">menu</span>
                    </button>
                    <div className="theme-toggler" onClick={changeColor}>
                        <span className="material-icons-sharp" id="light">light_mode</span>
                        <span className="material-icons-sharp">dark_mode</span>
                    </div>
                    <div className="profile">
                        <div className="info">
                            <p>Hey, <b>Athar</b></p>
                            <small className="text-muted" style={{ margin: "auto" }}>Admin</small>
                        </div>
                        <div className="profile-photo">
                            <img src={profile1} alt="hero" />
                        </div>
                    </div>
                </div>
                {/* hi */}
                {/* <!----------- END OF RECENT UPDATES -------> */}
                <div className="updates">
                    <AChart />
                </div>

                <div className="sales-analytics1">
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
                </div>
                {/* hi */}

            </div>
        </div>
    )
}

export default Coins