import { Contact, LucidePhone, Phone } from "lucide-react";
import React from "react";

const CalltoAction = () => {
  return (
    <div className="bg-[#f47458] ">
      <div className=" p-4 py-10 max-w-5xl mt-10 mx-auto flex items-center justify-between">
        <p className="capitalize text-2xl font-medium text-white w-80 text-wrap ">
          Have a question? Feel free to ask ...
        </p>
        <div className="flex items-center">
          <Contact className="w-6 h-6 text-white" />
          <span className="ml-2 text-white">+1 (123) 456-7890</span>
        </div>
      </div>
    </div>
  );
};

export default CalltoAction;
