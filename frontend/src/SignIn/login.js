
import "./signup.css";


import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { toast } from "react-toastify";

function Model(props) {

  const { scene } = useGLTF("/ethereum/scene.gltf");

  // Add a rotation animation to the model using useFrame hook
  useFrame(({ clock }) => {
    scene.rotation.y = Math.sin(clock.getElapsedTime() * 1) * 0.3;
  });

  return <primitive object={scene} {...props} />;
}
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");







  const onSubmitHandler = (e) => {
    e.preventDefault();

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
    fetch("https://crytotrade-app.onrender.com/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        // Add parameters here

        email: email,
        password: password,

      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data = data.data
        localStorage.setItem("token", data.token);
        window.localStorage.setItem("userId", JSON.stringify(data.userId));
        window.localStorage.setItem("email", data.email);
        window.localStorage.setItem("first_name", data.first_name);
        window.localStorage.setItem("last_name", data.last_name);
        toast.success("Login Successfull");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);

        // Handle data
      }
      )
      .catch((err) => {
        console.log(err.message);
        toast.error("Something Went Wrong");
      }
      );

  };







  return (
    // <div className="flex flex-row bg-[#2f2f2f] h-[100%]">
    <div className="Login_PAGE flex flex-row bg-[#2f2f2f] h-[100%]">
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
      </div>
      <div className="form-container w-[50%] flex flex-col justify-center">
        <div className="form-body w-[80%] md:w-[80%] lg:w-[60%] md:m-auto m-[5%]">
          <div className="form-header">
            <h1 className="text-5xl p-5 font-bold text-white">Sign In</h1>
          </div>
          <form action="https://crytotrade-app.onrender.com/api/auth/login" method="POST" onSubmit={onSubmitHandler}>

          <div className="form-input">
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
              Login
            </button>
          </div>
          </form>

          <div style={{ textAlign: "center" ,color:"white"}}>
            dont have an account{" "}
            <a href="/signup">
              <strong style={{color:"#0CB1CA"}}>Sign up here</strong>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;