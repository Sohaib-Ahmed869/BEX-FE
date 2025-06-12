import React from "react";
import Banner from "./banner";
import DrillServiceSelector from "./DrillServiceSelector";
import Stats from "./stats";
import CalltoAction from "./calltoAction";
import ListingSteps from "./ListingSteps";
import Footer from "./footer";
import FeaturedProducts from "./featuredProducts";

const LandingPage = () => {
  return (
    <div>
      <Banner />
      <DrillServiceSelector />
      <FeaturedProducts />
      <Stats />
      <ListingSteps />
      <CalltoAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
