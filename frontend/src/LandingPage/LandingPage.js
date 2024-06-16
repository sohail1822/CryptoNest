// import React from 'react';
// import './LandingPage.css';
// import Lnavbar from './lnavbar';
// import Lbanner from './lbanner';
// import Whyus from './whyus';
// import Footer from './footer';
// const LandingPage = () => {
//   return (
//     <div>
//     <Lnavbar/>
//     <Lbanner/>
//     <Whyus/>
//     <Footer/>
//     </div>
//   );
// };

// export default LandingPage;
import React from 'react';

// import GAChart from '../chart/graph';

import Aboutrem from '../aboutus/about-rem';
import Footer from './footer';
import phone1 from './images/phone.png'
import Shopify from './images/Shopify-Logo.svg'
// import image1 from './images/image1.png'
import PayPal from './images/PayPal-Logo.png'
import Oracle from './images/oracle.png'
// import Lnavbar from './lnavbar';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const LandingPage = () => {
  return (
    <>

      {/* <GAChart/> */}
      {/* <div className="fixed flex-col justify-center h-[100%] w-[100%] bg-[#ffffff]">
        <div className="endsignupButton flex flex-row justify-between mx-[12%] my-8">
          <div className="heading">
            <div className="text-[#000000] text-[4rem] font-bold m-0">
              Crypto
              <span className="text-[#ff0000]">Trade</span> */}

      {/* <Lnavbar /> */}
      <section className="text-gray-600 body-font"
        style={{ background: "#fff" }}
      >
        <div className="max-w-7xl mx-auto flex px-5 py-32 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left mb-40 items-center text-center"
            data-aos="fade-right"
            data-aos-offset="-100"
            data-aos-delay="50"
            data-aos-once="false"
            data-aos-duration="1000"
            data-aos-mirror="true"
            data-aos-easing="ease-in-out"
          >
            <h1 className="mb-5 sm:text-6xl text-5xl items-center Avenir xl:w-2/2 text-gray-900">
              The World's Fastest Growing Cryto Web App
            </h1>
            <p className="mb-4 xl:w-3/4 text-gray-600 text-lg">
              Buy and sell 200+ cryptocurrencies with 20+ flat currencies using bank transfers or your credit/debit card.
            </p>
            <div className="flex justify-center">
              <a
                className="inline-flex items-center px-5 py-3 mt-5 font-medium text-white hover:bg-slate-600 transition duration-500 ease-in-out transform border rounded-lg bg-gray-900"
                href="/signup"
              >
                <span className="justify-center">Sign Up</span>
              </a>
              <a
                className="inline-flex items-center mx-8 px-5 py-3 mt-5 font-medium text-black hover:bg-slate-300 transition duration-500 ease-in-out transform bg-white border rounded-lg bg-gray-900"
                style={{ border: "1px solid gray" }}
                href="/login"
              >
                <span className="justify-center hover:bg-white-700">Sign In</span>
              </a>

            </div>
          </div>
          <div className="xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-4 md:pl-10"
            data-aos="fade-left"
            data-aos-offset="100"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out">
            <img
              className="w-80  py-[-10%]"
              alt="iPhone-12"
              src="/119081-cryptocurrency-lottie-animation.gif"
            ></img>
          </div>
        </div>
        <section className="mx-auto" style={{display:'block'}}>
          <div className="px-5 mx-auto lg:px-24 ">
            <div className="flex flex-col w-full mb-4 text-left lg:text-center">
            </div>
            <div className="grid grid-cols-2 gap-16 mb-16 text-center lg:grid-cols-4">
              <div className="flex items-center justify-center"
                data-aos="fade-up"

                data-aos-anchor-placement="top-center"
                data-aos-duration="1000"
              >
                <img
                  src={phone1}
                  alt="Google Logo"
                  className="block object-contain h-16 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
                // data-aos-offset="300"
                data-aos-delay="50"
                data-aos-easing="ease-in-out"
                data-aos-duration="800"
              >
                <img
                  src={Shopify}
                  alt="Shopify Logo"
                  className="block object-contain h-16 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
                // data-aos-offset="300"
                data-aos-delay="50"
                data-aos-easing="ease-in-out"
                data-aos-duration="1000">
                <img
                  src={Oracle}
                  alt="Cloudflare Logo"
                  className="block object-contain h-16 greyC"
                ></img>
              </div>
              <div className="flex items-center justify-center"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
                // data-aos-offset="300"
                data-aos-delay="100"
                data-aos-easing="ease-in-out"
                data-aos-duration="1500">
                <img
                  src={PayPal}
                  alt="Paypal Logo"
                  className="block object-contain h-16 greyC"
                ></img>
              </div>
            </div>
          </div>
        </section>





        <Aboutrem />

        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center"
            data-aos="zoom-in"
            data-aos-offset="100"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <div className="py-24 md:py-36">
              <h1 className="mb-5 text-6xl Avenir font-semibold text-gray-900">
                Subscribe to our newsletter
              </h1>
              <h1 className="mb-9 text-2xl font-semibold text-gray-600">
                Enter your email address and get our newsletters straight away.
              </h1>
              <input
                placeholder="jack@example.com"
                name="email"
                type="email"
                autoComplete="email"
                className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-md text-gray-800 font-semibold hover:border-gray-900"
              ></input>{" "}
              <a
                className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium text-white transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-gray-900"
                href="/"
              >
                <span className="justify-center">Subscribe</span>
              </a>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default LandingPage;
