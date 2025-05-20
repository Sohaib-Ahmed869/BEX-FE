import React, { useEffect, useState } from "react";
import InitialScreen from "./initialSignupScreen";
import ImageGrid from "./imageGrid";
import BuyerForm from "./buyerForm";
import SellerForm from "./SellerForm";

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
        <div className="bg-[#F6F6F6] h-[108vh] flex justify-between">
          {formData.isSeller ? (
            <SellerForm updateFormData={updateFormData} formData={formData} />
          ) : (
            <BuyerForm updateFormData={updateFormData} formData={formData} />
          )}
          <ImageGrid />
        </div>
      )}
    </>
  );
};

export default Signup;
