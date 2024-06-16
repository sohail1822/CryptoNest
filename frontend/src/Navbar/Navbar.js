import React from 'react'
// import '../Dashboard/Dashboard.css'
import logo from '../assets/logo.png'
import './Navbar.css'
import Mnavbar from './mnavbar'
const Navbar = () => {
    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        window.location.href = '/'
    }
    

  return (
    <>
    <div className='mobile'>
    <Mnavbar />
    </div>
    <div className='navbar-container'>
      <aside>
                <div className="top">
                    <div className="logo1">
                        <img src={logo} alt="hero" />
                        <h2>Coin<span className="danger">Bazaar</span></h2>
                    </div>
                    <div className="close" id="close-btn">
                        <span className="material-icons-sharp">close</span>
                    </div>
                </div>


                <div className="sidebar">
                    {/* <a href="/">
                        <span className="material-icons-sharp">grid_view</span>
                        <h3>Home</h3>
                    </a> */}
                    <a href="/dashboard" >
                        <span className="material-icons-sharp">person_outline</span>
                        <h3>Dashboard</h3>
                    </a>
                    <a href="/market">
                        <span className="material-icons-sharp">insights</span>
                        <h3>Market</h3>
                    </a>
                    <a href="/messages">
                        <span className="material-icons-sharp">mail_outline</span>
                        <h3>News Info</h3>
                        <span className="message-count">26</span>
                    </a>
                    {/* <a href="/">
                        <span className="material-icons-sharp">inventory</span>
                        <h3>Wallet</h3>
                    </a> */}
                    {/* <a href="/">
                        <span className="material-icons-sharp">settings</span>
                        <h3>Settings</h3>
                    </a> */}
                    {/* <a href="/">
                        <span className="material-icons-sharp">add</span>
                        <h3>Add Products</h3>
                    </a> */}
                    <a onClick={logOut}>
                        <span className="material-icons-sharp">logout</span>
                        <h3>logout</h3>
                    </a>
                </div>
            </aside>
    </div>
    </>
  )
}

export default Navbar
