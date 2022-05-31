import React, { useState, useEffect } from "react";
import About from "./components/About";
import Roadmap from "./components/Roadmap";
import Rubmle from "./components/Rumble";
import Nav from "./components/Nav";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { mainContext } from './Contexts/mainContext';
import contractAbi from "./Abis/lmac.json";

function App() {
  // const [userInfo, setUserInfo] = useState();
  let [ChainId, setChainId] = useState();
  let [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [render, setRender] = useState();
  const contractAddress = '0x46dBbc95A416B79eC734bdf078e2309671CD894e'

  const data = async (provider) => {
    // regular web3 provider methods
    const newWeb3 = new Web3(provider);
    setProvider(newWeb3);
    const cId = await newWeb3.eth.getChainId();
    setChainId(ChainId = cId);
    console.log(ChainId);
    // if (ChainId == 97 || 56) {
    if (ChainId == 4 || ChainId == 1) {
      loadContract()
      const accounts = await newWeb3.eth.getAccounts();
      setAccount(account = accounts[0]);
      console.log(account)
    } else {
      alert('Please change chain to Rinkeby || Ethereum Network')
    }
  }

  //FUNCTIONS
  const loadContract = () => {
    // Getting WEB3
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;
    const contract = new web3.eth.Contract(
      contractAbi.abi,
      contractAddress
    )
    setContract(contract)
    console.log(contract)
  };

  useEffect(() => {
    try {
      loadContract()
    } catch (e) {
      console.log(e)
    }
  }, [])

  const loadWeb3 = async () => {
    try {
      const providerOptions = {
        /* See Provider Options Section */
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
              1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
            },
            // chainId: 4
            chainId: [4, 1]
          }
        }
      };

      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions, // required
        disableInjectedProvider: false,
      });
      const preProvider = await web3Modal.connect();
      window.ethereum.on("chainChanged", async (chainId) => {
        console.log(typeof (chainId))
        if (chainId === "0x4" || chainId === "0x1") {
          loadContract()
        }
        else {
          alert('Please change chain to Rinkeby || Ethereum Network')
        }
      });
      window.ethereum.on("accountsChanged", async (accounts) => {
        // const preProvider = await web3Modal.connect();
        setAccount(account = accounts[0]);
        // data(preProvider)
      });
      await web3Modal.toggleModal();
      data(preProvider)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <mainContext.Provider
      value={{
        provider, contract
        , render, setRender,
        contract, account
      }}
    >

      <div className="container-fluid p-0">
        {/* <Nav/> */}
        <div className="leftIcons">
          <a href="https://discord.gg/rumblebirds">
            <i className="fa-brands fa-discord"></i>
          </a>
          <a href="https://twitter.com/RumbleBirds">
            <i class="fa-brands fa-twitter-square"></i>
          </a>

        </div>

        <div className="banner">
          <div className="col-md-8 mx-auto d-flex justify-content-center  align-items-center">
            <div className="navLinks">
              <a href="#">Home</a>
              <a href="#about">Mint</a>
              <a href="#rubmle">Road_Map</a>
            </div>
            <button className="connetBtn" onClick={() =>
              loadWeb3()
            } >CONNECT</button>
          </div>
          <img
            className="logo"
            src={require("./images/LogoNew.png").default}
            alt="image"

          />
        </div>
      </div>

      <About />
      <Rubmle />
      <Roadmap />
    </mainContext.Provider>
  );
}

export default App;
