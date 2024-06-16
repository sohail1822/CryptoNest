import React from 'react';
import './footer.css';
import logo from './../SignIn/logo.png'
const Footer = () => {
  return (
    <>
    
    <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
        <div class="text-center md:border-r">
          <h6 class="text-4xl font-bold lg:text-5xl xl:text-6xl">10K</h6>
          <p class="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
            Downloads
          </p>
        </div>
        <div class="text-center md:border-r">
          <h6 class="text-4xl font-bold lg:text-5xl xl:text-6xl">2.4K</h6>
          <p class="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
            Subscribers
          </p>
        </div>
        <div class="text-center md:border-r">
          <h6 class="text-4xl font-bold lg:text-5xl xl:text-6xl">8.6K</h6>
          <p class="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
            Users
          </p>
        </div>
        <div class="text-center">
          <h6 class="text-4xl font-bold lg:text-5xl xl:text-6xl">1.5K</h6>
          <p class="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
            Cookies
          </p>
        </div>
      </div>
    </div>
    <div id='footer-id'>
      <div className="pg-footer">
        <footer className="footer">
          <svg className="footer-wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path className="footer-wave-path" d="M851.8,100c125,0,288.3-45,348.2-64V0H0v44c3.7-1,7.3-1.9,11-2.9C80.7,22,151.7,10.8,223.5,6.3C276.7,2.9,330,4,383,9.8 c52.2,5.7,103.3,16.2,153.4,32.8C623.9,71.3,726.8,100,851.8,100z"></path>
          </svg>
          <div className="footer-content">
            <div className="footer-content-column">
              <div className="footer-logo">
                <a className="footer-logo-link" href="#">
                  <span className="hidden-link-text">LOGO</span>
                  <div><img className="nav-logo" src={logo} alt="Logo" />
                  </div><strong style={{ fontSize: "20px", color: "white", padding: "20px 0" }}>HackElites</strong>
                </a>
              </div>
              <div className="footer-menu">
                <h2 className="footer-menu-name"> Get Started</h2>
                <ul id="menu-get-started" className="footer-menu-list">
                  <li className="menu-item menu-item-type-post_type menu-item-object-product">
                    <a href="#">Start</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-product">
                    <a href="#">Documentation</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-product">
                    <a href="#">Installation</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-content-column">
              <div className="footer-menu">
                <h2 className="footer-menu-name"> Company</h2>
                <ul id="menu-company" className="footer-menu-list">
                  <li className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a href="#">Contact</a>
                  </li>
                  <li className="menu-item menu-item-type-taxonomy menu-item-object-category">
                    <a href="#">News</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a href="#">Careers</a>
                  </li>
                </ul>
              </div>
              <div className="footer-menu">
                <h2 className="footer-menu-name"> Legal</h2>
                <ul id="menu-legal" className="footer-menu-list">
                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-170434">
                    <a href="#">Privacy Notice</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a href="#">Terms of Use</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-content-column">
              <div className="footer-menu">
                <h2 className="footer-menu-name"> Quick Links</h2>
                <ul id="menu-quick-links" className="footer-menu-list">
                  <li className="menu-item menu-item-type-custom menu-item-object-custom">
                    <a target="_blank" rel="noopener noreferrer" href="#">Support Center</a>
                  </li>
                  <li className="menu-item menu-item-type-custom menu-item-object-custom">
                    <a target="_blank" rel="noopener noreferrer" href="#">Service Status</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a href="#">Security</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a href="#">Blog</a>
                  </li>
                  <li className="menu-item menu-item-type-post_type_archive menu-item-object-customer">
                    <a href="#">Customers</a></li>
                  <li className="menu-item menu-item-type-post_type menu-item-object-page">
                    <a href="#">Reviews</a>
                  </li>
                </ul>
                <div class="footer-col">
                  {/* <h4>follow us</h4> */}
                  <div class="social-links">
                    {/* <a href="#"><i class="fab fa-facebook-f"></i></a> */}
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-content-column">
              <div className="footer-call-to-action">
                <h2 className="footer-call-to-action-title"> Let's Chat</h2>
                <p className="footer-call-to-action-description"> Have a support question?</p>
                <a className="footer-call-to-action-button button" href="#" target="_self"> Get in Touch </a>
              </div>
              <div className="footer-call-to-action">
                <h2 className="footer-call-to-action-title"> You Call Us</h2>
                <p className="footer-call-to-action-link-wrapper"> <a className="footer-call-to-action-link" href="tel:0124-64XXXX" target="_self"> 0124-64XXXX </a></p>
              </div>
            </div>

          </div>
          <div className="footer-copyright">
            <div className="footer-copyright-wrapper">
              <p className="footer-copyright-text">
                <a className="footer-copyright-link" href="#" target="_self"> ©2023. | Designed By: Hack elites. | All rights reserved. </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default Footer;
