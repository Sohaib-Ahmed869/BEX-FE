import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdLockOutline } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import ImageGrid from "./imageGrid";
import { motion } from "framer-motion";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Bounce, toast, ToastContainer } from "react-toastify";
import PasswordStrengthBar from "react-password-strength-bar";

const InitialScreen = ({ updateFormData, setInitialFilled, formData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleContinue = (e) => {
    e.preventDefault();
    // Check if email is empty or doesn't include @
    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if password is empty
    if (!formData.password || formData.password.length === 0) {
      toast.error("Please enter a password");
      return;
    }

    // Check if password is too short (existing logic)
    if (formData.password.length <= 6) {
      toast.error("Password must be more than 6 characters");
      return;
    }

    setInitialFilled(true);
  };

  // Animation variants for signup form
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
    <div className="bg-[#F6F6F6] min-h-screen flex flex-col lg:flex-row lg:justify-between overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        transition={Bounce}
        newestOnTop={true}
      />
      {/* Signup Form Side */}
      <div className="w-full lg:w-1/3 md:w-1/2 sm:w-full mx-auto my-auto flex items-center justify-center px-4 py-4  lg:py-0">
        <motion.form
          initial="hidden"
          animate="visible"
          variants={formVariants}
          action=""
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-lg py-6 sm:py-8 lg:py-8 xl:py-8 px-6 sm:px-8 lg:px-10 xl:px-12 bg-white rounded-2xl lg:rounded-3xl flex flex-col shadow-lg"
        >
          <motion.span
            custom={0}
            variants={itemVariants}
            className="text-sm sm:text-base text-gray-400 font-regular"
          >
            Welcome to BEX!
          </motion.span>

          <motion.h1
            custom={1}
            variants={itemVariants}
            className="font-bold text-4xl md:text-4xl sm:text-4xl lg:text-4xl leading-tight mb-2 lg:mb-3"
          >
            Sign up
          </motion.h1>

          <motion.div
            custom={2}
            variants={itemVariants}
            className="mb-3 lg:mb-4"
          >
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-bold my-1 block"
            >
              Email
            </label>
            <div className="relative">
              <CiMail
                size={18}
                className="absolute top-3 sm:top-4 left-3 text-gray-300"
              />
              <input
                type="email"
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="Your email"
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-10 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          <motion.div
            custom={3}
            variants={itemVariants}
            className="mb-3 lg:mb-4"
          >
            <label
              htmlFor="password"
              className="text-xs sm:text-sm font-bold my-1 block"
            >
              Password
            </label>
            <div className="relative">
              <MdLockOutline
                size={18}
                className="absolute top-3 sm:top-4 left-3 text-gray-300"
              />
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="w-full py-2.5 sm:py-3 lg:py-3.5 px-10 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                placeholder="Password"
              />
              {showPassword ? (
                <IoMdEye
                  size={18}
                  className="absolute right-3 cursor-pointer top-3 sm:top-4 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <IoMdEyeOff
                  size={18}
                  className="absolute right-3 cursor-pointer top-3 sm:top-4 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <PasswordStrengthBar
              className="mt-4 w-[95%] mx-auto "
              password={formData.password}
            />
          </motion.div>

          <motion.div
            custom={4}
            variants={itemVariants}
            className="flex items-center mb-3 lg:mb-4"
          >
            <input
              type="checkbox"
              onChange={(e) => updateFormData("isSeller", e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="isSeller"
              className="text-xs sm:text-sm font-medium"
            >
              I am a Seller{"   "}
              <span className="text-gray-400 font-xs">
                (Leave unchecked if you are a Buyer)
              </span>
            </label>
          </motion.div>

          <motion.button
            custom={5}
            variants={{
              ...itemVariants,
              ...buttonVariants,
            }}
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => handleContinue(e)}
            className="w-full py-2.5 sm:py-3 lg:py-3.5 mt-3 sm:mt-4 lg:mt-5 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors cursor-pointer text-sm font-medium"
          >
            Continue
          </motion.button>

          <motion.span
            custom={6}
            variants={itemVariants}
            className="text-center my-2 lg:my-3 text-sm text-gray-500"
          >
            or
          </motion.span>

          <motion.button
            custom={7}
            variants={{
              ...itemVariants,
              ...buttonVariants,
            }}
            whileHover="hover"
            whileTap="tap"
            type="button"
            className="flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 lg:py-3.5 border-2 border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors"
          >
            <FcGoogle size={18} />
            Continue using Google
          </motion.button>

          <motion.span
            custom={8}
            variants={itemVariants}
            className="text-center mt-4 sm:mt-5 lg:mt-6 text-gray-400 font-medium text-sm"
          >
            Already have an account?
            <Link className="text-[#F47458] ml-1 hover:underline" to={"/login"}>
              Login
            </Link>
          </motion.span>
        </motion.form>
      </div>

      {/* Image Grid Side - Hidden on mobile and tablet */}
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
        className="hidden lg:flex lg:w-1/2"
      >
        <ImageGrid />
      </motion.div>
    </div>
  );
};

export default InitialScreen;
