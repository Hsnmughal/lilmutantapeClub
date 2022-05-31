import React, { useContext, useState } from "react";
import { mainContext } from "../Contexts/mainContext";

const About = () => {
  const { contract, account } = useContext(mainContext);
  const solMint = () => {
    console.log("sol function is calling");
  };

  const ethMint = () => {
    try {
      await contract.methods.mint(20).send({ from: account }).then(() => {
        alert("Minting Successful");
      })

    } catch (e) {
      console.log(e)
    }
  };

  return (
    <>
      <div className="container-fluid p-0 mt-5" id="about">
        <div className="bannerOne">
          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-md-9 mx-auto">
                <h1 className="currency mt-0">CHOOSE YOUR TEAM</h1>
              </div>

              <div className="col-md-6 mx-auto d-flex flex-column align-items-center align-items-md-end leftSection pb-4 pe-auto pe-md-5">
                <div className="customCard shadow">
                  <h1 className="cardHeading">
                    Team SOL <br /> Mint Your Rumble Bird
                  </h1>

                  <p className="para mt-4">
                    SOL Rumble Birds are a collection of pixelated NFTs that
                    setup their rumble camp on the Solana blockchain
                  </p>
                  <p className="para">
                    and are at war against the ETH Rumble Birds battling it out
                    for the title of best blockchain champion.
                  </p>

                  <div className="text-center">
                    <button onClick={solMint} className="mintBtn">
                      MINT
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mx-auto d-flex flex-column align-items-center align-items-md-start   rightSection pb-4 ps-auto ps-md-5">
                <div className="customCard shadow">
                  <h1 className="cardHeading">
                    team ETH <br /> Mint Your Rumble Bird
                  </h1>

                  <p className="para mt-4">
                    ETH Rumble Birds are a collection of pixelated NFTs that
                    setup their rumble camp on the Solana blockchain
                  </p>

                  <p className="para">
                    and are at war against the SOL Rumble Birds battling it out
                    for the title of best blockchain champion.
                  </p>

                  <div className="text-center">
                    <button onclick={() => ethMint()} className="mintBtn">
                      MINT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
