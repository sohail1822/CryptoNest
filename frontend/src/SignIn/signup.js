
import "./signup.css";
import logo from "./logo.png";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
function Model(props) {
  const { scene } = useGLTF("/ethereum/scene.gltf");

  // Add a rotation animation to the model using useFrame hook
  useFrame(({ clock }) => {
    scene.rotation.y = Math.sin(clock.getElapsedTime() * 1) * 0.3;
  });

  return <primitive object={scene} {...props} />;
}
const Signup = () => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  // const [errorMessages, setErrorMessages] = useState({});
  // const [isSubmitted, setIsSubmitted] = useState(false);
  // Generate JSX code for error message

  // const renderErrorMessage = (name) =>
  //   name === errorMessages.name && (
  //     <div className="error">{errorMessages.message}</div>
  //   );
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(phone);
    // Using Fetch API
    // axios.post("http://localhost:5000/api/auth/signup", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     // Add parameters here
    //     firstname,
    //     lastname,
    //     email,
    //     password,
    //     phone,
    //     address,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     // Handle data
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
    fetch("https://crytotrade-app.onrender.com/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        // Add parameters here
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
        phone: phone,
        address: address,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(data.success){
                  data = data.data;
                  localStorage.setItem("token", data.token);
                  window.localStorage.setItem(
                    "userId",
                    JSON.stringify(data.userId)
                  );
                  window.localStorage.setItem("email", data.email);
                  window.localStorage.setItem("first_name", data.first_name);
                  window.localStorage.setItem("last_name", data.last_name);
                  toast.success("Signup Successfull");
                  setTimeout(() => {
                    window.location.href = "/dashboard";
                  }
                  , 2000);
        }else{
          toast.error(data.data.message);
          console.log(data.data.message);
        }
        // window.location.href = "/dashboard";
        // Handle data
      }
      )
      .catch((err) => {
        console.log(err.message)
        ;
        toast(err.message);
        setTimeout(() => {
          window.location.href = "/signup";
        }
        , 2000);
      }
      );

  };
  return (
    <div className="Login_PAGE flex flex-row bg-[#2f2f2f] h-[100%]">
      {/* <ToastContainer /> */}
      {/* <div className="  companyname"> */}
        {/* <div className="innerdiv">
          <h2>
            Need webdesign for your page? designspace will help you... text for
            trading app
          </h2>
          <div style={{ textAlign: "center" }}>
            <img src={logo} className="logo" alt="company name"></img>
          </div>
        </div> */}
        <div className="a3d-model w-[50%]">
        {/* rotate the 3d model */}
        <Canvas
          dpr={[1, 2]}
          camera={{ fav: 45 }}
          style={{
            position: "relative",
            backgroundColor: "black",
            height: "100vh",
          }}
        >
          <PresentationControls
            speed={1.5}
            global
            zoom={0.2}
            polar={[-0.1, Math.PI / 4]}
          >
            <Stage environment={null}>
              <Model scale={0.005} />
            </Stage>
          
          </PresentationControls>
          
        </Canvas>
      {/* </div> */}

      </div>


      <div className="form-container w-[50%] flex flex-col justify-center">
        <div className="form-body w-[80%] md:w-[80%] lg:w-[60%] md:m-auto m-[5%]">
          <div className="form-header">
            <h1 className="text-5xl p-5 font-bold text-white">Sign Up</h1>
          </div>

        <form action="https://crytotrade-app.onrender.com/api/auth/signup" method="POST" onSubmit={onSubmitHandler}>
          <div className="form-input">
            <input
                placeholder="first name"
                type="text"
                
                onChange={(e) => setfirstname(e.target.value)}
                value={firstname}
                name="first_name"

              className="firstname m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            <input
                placeholder="last name"
                type="text"
                
                onChange={(e) => setlastname(e.target.value)}
                value={lastname}
                name="last_name"

              className="lastname m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            <input
                placeholder="email"
                type="email"
                
                onChange={(e) => setemail(e.target.value)}
                value={email}
                name="email"

              className="email m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            <input
                placeholder="phone"
                type="tel"
                pattern="[0-9]{10}"

                onChange={(e) => setphone(e.target.value)}
                value={phone}
                name="phone"

              className="phone m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            <input
                placeholder="address"
                type="text"

                onChange={(e) => setaddress(e.target.value)}
                value={address}
                name="address"

              className="address m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            <input
                placeholder="password"
                type="password"

                onChange={(e) => setpassword(e.target.value)}
                value={password}
                name="password"

              className="password m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            
          </div>
          <div className="form-button">
            <button
            type="submit"
              className="login-button m-5"
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#0CB1CA",
              }}
            >
              Sign up
            </button>
          </div>
        </form>
        <div style={{ textAlign: "center" ,color:"white"}}>
            already have an account{" "}
            <a href="/login">
              <strong style={{color:"#0CB1CA"}}>login here</strong>
            </a>
          </div>
      </div>
      </div>
    </div>
  );
};

export default Signup;
