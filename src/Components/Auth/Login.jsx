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
import CubeLoader from "../../utils/cubeLoader";
import GoogleAuthButton from "./GoogleAuth/googleAuthButton";
import useGoogleAuth from "../../services/googleAuth";
import GoogleSellerForm from "./GoogleAuth/googleSellerForm";
import RoleSelectionModal from "./GoogleAuth/RoleSelectionModel";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    showRoleModal,
    showSellerForm,
    googleUserData,
    loading,
    handleRoleSelect,
    completeSellerRegistration,
    cancelRegistration,
  } = useGoogleAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authenticate(email, password);
      console.log(response);
      localStorage.setItem("token", response.token);
      sessionStorage.setItem("jwtToken", response.token);
      // toast.success("Login successful!");
      if (response.user.role === "buyer") {
        setLoading(false);
        navigate("/products");
      }
      if (response.user.role === "seller") {
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Login failed!");
    } finally {
      setLoading(false);
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
    <>
      <div className="bg-[#F6F6F6] min-h-screen flex flex-col lg:flex-row lg:justify-between overflow-hidden">
        {Loading && <CubeLoader />}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          transition={Bounce}
          newestOnTop={true}
        />

        {/* Login Form Side */}
        <div className="w-full lg:w-1/3 md:w-1/2 sm:w-full mx-auto my-auto  flex items-center justify-center px-4 py-4 lg:py-0">
          <motion.form
            initial="hidden"
            animate="visible"
            variants={formVariants}
            onSubmit={(e) => handleLogin(e)}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-lg py-6 sm:py-8 lg:py-10 xl:py-12 px-6 sm:px-8 lg:px-10 xl:px-12 bg-white rounded-2xl lg:rounded-3xl flex flex-col shadow-lg"
          >
            <motion.span
              custom={0}
              variants={itemVariants}
              className="text-sm sm:text-base text-gray-400 font-regular"
            >
              Welcome back!
            </motion.span>

            <motion.h1
              custom={1}
              variants={itemVariants}
              className="font-bold text-4xl  md:text-4xl sm:text-4xl lg:text-4xl    leading-tight mb-2 lg:mb-3"
            >
              Sign in
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full py-2.5 sm:py-3 lg:py-3.5 px-10 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                  value={email}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 sm:py-3 lg:py-3.5 px-10 text-gray-700 rounded-lg bg-white border-gray-300 border-2 text-sm focus:border-[#F47458] focus:outline-none transition-colors"
                  placeholder="Password"
                  value={password}
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
              className="w-full py-2.5 sm:py-3 lg:py-3.5 mt-3 sm:mt-4 lg:mt-5 bg-[#F47458] text-white rounded-lg hover:bg-[#e06449] transition-colors cursor-pointer text-sm font-medium"
            >
              Continue
            </motion.button>

            <motion.span
              custom={5}
              variants={itemVariants}
              className="text-center my-2 lg:my-3 text-sm text-gray-500"
            >
              or
            </motion.span>

            {/* <motion.button
            custom={6}
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
          </motion.button> */}
            <GoogleAuthButton text="Continue using Google" />
            <motion.span
              custom={7}
              variants={itemVariants}
              className="text-center mt-4 sm:mt-5 lg:mt-6 text-gray-400 font-medium text-sm"
            >
              Don't have an account?
              <Link
                className="text-[#F47458] ml-1 hover:underline"
                to={"/signup"}
              >
                Sign-up
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
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={cancelRegistration}
        onRoleSelect={handleRoleSelect}
      />

      {showSellerForm && (
        <GoogleSellerForm
          googleUserData={googleUserData}
          onSubmit={completeSellerRegistration}
          onCancel={cancelRegistration}
        />
      )}
    </>
  );
};

export default Login;
