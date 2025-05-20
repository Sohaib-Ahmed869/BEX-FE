import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { MdLockOutline } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import ImageGrid from "./imageGrid";
import { authenticate } from "../../services/AuthServices";
import { motion } from "framer-motion";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticate(email, password);
      console.log(response);
      localStorage.setItem("token", response.token);
      sessionStorage.setItem("jwtToken", response.token);
      toast.success("Login successful!");
      if (response.user.role === "buyer") {
        navigate("/products");
      }
      if (response.user.role === "seller") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed!");
    }
  };

  // Animation variants for login form
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for form elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Animation for the buttons
  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="bg-[#F6F6F6] h-screen flex justify-between overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />

      {/* Login Form Side */}
      <div className="w-1/2 flex items-center justify-center">
        <motion.form
          initial="hidden"
          animate="visible"
          variants={formVariants}
          onSubmit={(e) => handleLogin(e)}
          className="w-[598px] py-20 px-25 bg-white rounded-3xl flex flex-col shadow-lg"
        >
          <motion.span
            custom={0}
            variants={itemVariants}
            className="text-base text-gray-400 font-regular"
          >
            Welcome back!
          </motion.span>

          <motion.h1
            custom={1}
            variants={itemVariants}
            className="font-bold text-6xl leading-tight mb-3"
          >
            Sign in
          </motion.h1>

          <motion.div custom={2} variants={itemVariants} className="mb-4">
            <label htmlFor="email" className="text-sm font-bold my-1 block">
              Email
            </label>
            <div className="relative">
              <CiMail
                size={20}
                className="absolute top-5 left-3 text-gray-300"
              />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full py-4 px-10 text-gray-700 rounded-lg bg-white border-gray-300 border-2"
                value={email}
              />
            </div>
          </motion.div>

          <motion.div custom={3} variants={itemVariants} className="mb-4">
            <label htmlFor="password" className="text-sm font-bold my-1 block">
              Password
            </label>
            <div className="relative">
              <MdLockOutline
                size={20}
                className="absolute top-5 left-3 text-gray-300"
              />
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 px-10 text-gray-700 rounded-lg bg-white border-gray-300 border-2"
                placeholder="Password"
                value={password}
              />
              {showPassword ? (
                <IoMdEye
                  size={20}
                  className="absolute  right-2 cursor-pointer top-5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <IoMdEyeOff
                  size={20}
                  className="absolute  right-2 cursor-pointer top-5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </motion.div>

          <motion.button
            custom={4}
            variants={{
              ...itemVariants,
              ...buttonVariants,
            }}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="w-full py-4 mt-6 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors cursor-pointer"
          >
            Continue
          </motion.button>

          <motion.span
            custom={5}
            variants={itemVariants}
            className="text-center my-3"
          >
            or
          </motion.span>

          <motion.button
            custom={6}
            variants={{
              ...itemVariants,
              ...buttonVariants,
            }}
            whileHover="hover"
            whileTap="tap"
            type="button"
            className="flex items-center justify-center gap-4 px-4 py-4 border-2 border-gray-200 rounded-lg"
          >
            <FcGoogle size={20} />
            Continue using Google
          </motion.button>

          <motion.span
            custom={7}
            variants={itemVariants}
            className="text-center mt-8 text-gray-400 font-medium"
          >
            Don't have an account?
            <Link className="text-[#F47458] ml-1" to={"/signup"}>
              Sign-up
            </Link>
          </motion.span>
        </motion.form>
      </div>

      {/* Image Grid Side */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: 0.3,
          },
        }}
        className="w-1/2"
      >
        <ImageGrid />
      </motion.div>
    </div>
  );
};

export default Login;
