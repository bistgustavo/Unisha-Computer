import React from "react";
import Carousel from "../Carousel";
import Categories from "../Categories";
import BestSeller from "../BestSeller";

function Home() {

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="mt-4 animate-slideInDown">
        <Carousel />
      </div>

      <div
        className="mt-8 sm:mt-12 animate-slideInUp"
        style={{ animationDelay: "0.2s" }}
      >
        <Categories />
      </div>

      <div
        className="mt-8 sm:mt-12 pb-8 animate-slideInUp"
        style={{ animationDelay: "0.4s" }}
      >
        <BestSeller />
      </div>
    </div>
  );
}

export default Home;
