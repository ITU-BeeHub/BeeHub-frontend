import React from "react";
import BeakerIcon from "./icons/BeakerIcon"; // Assuming this is your app logo
import "./LoadingAnimation.css";


interface LoadingAnimationProps {
  mainText?: string;
  subText?: string;
  animationType?: "spin" | "bounce";
  spinDuration?: number; // in seconds
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  mainText = "Loading...",
  subText = "Please wait",
  animationType = "spin",
  spinDuration = 2,
}) => {
  return (
    <div className="loading-container">
      <div className="loading-logo-container">
        <BeakerIcon
          className={`loading-logo ${animationType}`}
          style={{ animationDuration: `${spinDuration}s` }}
        />
      </div>
      <div className="loading-text">{mainText}</div>
      {subText && <div className="loading-subtext">{subText}</div>}
    </div>
  );
};

export default LoadingAnimation;
