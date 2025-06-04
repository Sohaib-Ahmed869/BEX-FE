import React, { useEffect, useState } from "react";
import InitialScreen from "./initialSignupScreen";
import ImageGrid from "./imageGrid";
import BuyerForm from "./buyerForm";
import SellerForm from "./SellerForm";
import { motion } from "framer-motion";

const Signup = () => {
  // Combined form data in a single state object
  const [initialFilled, setInitialFilled] = useState(false);
  const [formData, setFormData] = useState({
    // Shared fields
    email: "",
    password: "",
    isSeller: false,

    // Buyer specific fields
    first_name: "",
    last_name: "",
    phone: "",

    // Seller specific fields
    name: "",
    companyName: "",
    companyRegistrationNumber: "",
    countryOfRegistration: "",
    businessAddress: "",
    websiteUrl: "",
    licenseImage: null,
    postalCode: "",
    city: "",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Generalized function to update any form field
  const updateFormData = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      {!initialFilled && (
        <InitialScreen
          updateFormData={updateFormData}
          formData={formData}
          setInitialFilled={setInitialFilled}
        />
      )}
      {initialFilled && (
        <div className="bg-[#F6F6F6] min-h-screen flex flex-col lg:flex-row lg:justify-between overflow-hidden">
          {formData.isSeller ? (
            <SellerForm updateFormData={updateFormData} formData={formData} />
          ) : (
            <BuyerForm updateFormData={updateFormData} formData={formData} />
          )}

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
      )}
    </>
  );
};

export default Signup;
