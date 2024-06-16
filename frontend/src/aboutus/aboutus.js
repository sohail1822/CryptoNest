import React from 'react';
import './aboutus.css';
import Lnavbar from './../LandingPage/lnavbar';
import Footer from './../LandingPage/footer';
import Aboutbanner from './about-banner';
import Aboutrem from './about-rem';

const Aboutus = () => {
  return (
    <div>
    <Lnavbar/>
    <Aboutbanner/>
    <Aboutrem/>
    <Footer/>
    </div>
  );
};

export default Aboutus;
