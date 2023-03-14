import { Box, Spinner } from "@chakra-ui/react";
import React from "react";
import "./LoadingSection.css";

const LoadingSection = () => {
  return (
    <div className="circleContainer">
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div className="circle3"></div>
      <div className="loading">LOADING...</div>
    </div>
  );
};

export default LoadingSection;
