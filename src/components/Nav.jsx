import React from "react";

const Nav = () => {
  return (
    <div className="customNav">
      <div className="container">
        <div className="col-md-8 mx-auto d-flex justify-content-center  align-items-center">          
          <div className="navLinks">
            <a href="#">Home</a>  
            <a href="#about">Mint</a>          
            <a href="#rubmle">Road_Map</a>
            </div>
            <button className="connetBtn">CONNECT</button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
