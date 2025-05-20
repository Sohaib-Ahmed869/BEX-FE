import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdLockOutline } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import ImageGrid from "./imageGrid";
import { motion } from "framer-motion";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
const InitialScreen = ({ updateFormData, setInitialFilled }) => {
  // Animation variants for form container
  const [showPassword, setShowPassword] = useState(false);

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
      {/* Form Side */}
      <div className="w-1/2 flex items-center justify-center">
        <motion.form
          initial="hidden"
          animate="visible"
          variants={formVariants}
          action=""
          className="w-[598px] py-20 px-25 bg-white rounded-3xl flex flex-col shadow-lg"
        >
          <motion.span
            custom={0}
            variants={itemVariants}
            className="text-base text-gray-400 font-regular"
          >
            Welcome to BEX!
          </motion.span>

          <motion.h1
            custom={1}
            variants={itemVariants}
            className="font-bold text-6xl leading-tight mb-3"
          >
            Sign up
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
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="Your email"
                className="w-full block py-4 px-10 md:px-10 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 "
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
                onChange={(e) => updateFormData("password", e.target.value)}
                className="w-full block py-4 px-10 md:px-10 text-gray-700 mt-2 rounded-lg bg-white border-gray-300 border-2 "
                placeholder="Password"
              />{" "}
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

          <motion.div
            custom={4}
            variants={itemVariants}
            className="flex items-center mt-2 mb-4"
          >
            <input
              type="checkbox"
              onChange={(e) => updateFormData("isSeller", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isSeller" className="text-sm font-medium">
              I am a Seller
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
            onClick={() => setInitialFilled(true)}
            className="w-full py-4 mt-6 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors cursor-pointer"
          >
            Continue
          </motion.button>

          <motion.span
            custom={6}
            variants={itemVariants}
            className="text-center my-3"
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
            className="flex items-center justify-center gap-4 px-14 py-4 border-2 border-gray-200 rounded-lg"
          >
            <FcGoogle size={20} />
            Continue using google
          </motion.button>

          <motion.span
            custom={8}
            variants={itemVariants}
            className="text-center mt-10 text-gray-400 font-medium"
          >
            Already have an account?
            <Link className="text-[#F47458] ml-1" to={"/login"}>
              Login
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

export default InitialScreen;
