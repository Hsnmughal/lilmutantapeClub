import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import contractAbi from "./Abis/lmac.json";
import { NavLink } from "react-router-dom";



const Main = () => {
  let [ChainId, setChainId] = useState();
  let [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const contractAddress = "0x1448A9Cd7ecF26f4f19Ea39e7BFE175987c180D3";
  const [connected, setConnected] = useState(false);
  let [mintPriceState, setMintPrice] = useState(0);
  let [totalSupplyState, setTotalSupply] = useState(0);
  const [successful, setSucccesful] = useState(false);

  const data = async (provider) => {
    const newWeb3 = new Web3(provider);
    setProvider(newWeb3);
    const cId = await newWeb3.eth.getChainId();
    setChainId((ChainId = cId));
    console.log(ChainId);
    if (ChainId == 4 || ChainId == 1) {
      loadContract();
      // const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const accounts = await newWeb3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts[0]);
      setConnected(true)
    } else {
      alert("Please change chain to Ethereum Network");
    }
  };

  const loadContract = () => {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;
    const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);
    setContract(contract);
    console.log(contract);
  };

  useEffect(() => {
    try {
      loadContract();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      totalSupply();
    } catch (e) {
      console.log(e);
    }
  }, [contract, successful]);

  const loadWeb3 = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
              1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            },
            chainId: [4, 1],
          },
        },
      };


      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        disableInjectedProvider: false,
      });
      // await web3Modal.enable();
      const preProvider = await web3Modal.connect();
      subscribeProvider(preProvider);


      // await preProvider.request({ method: 'eth_requestAccounts' });
      data(preProvider).then((r) => { });
    } catch (e) {
      console.log(e);
    }
  };

  const subscribeProvider = (preProvider) => {
    if (!preProvider.on) {
      return;
    }
    // provider.on("close", () => this.resetApp());
    preProvider.on("accountsChanged", async (accounts) => {
      setAccount((account = accounts[0]));
    });
    preProvider.on("chainChanged", async (chainId) => {
      if (chainId === "0x4" || chainId === "0x1") {
        loadContract();
      } else {
        alert("Please change chain to Rinkeby || Ethereum Network");
      }
    });
    // provider.on("networkChanged", async (networkId) => {
    //   const { web3 } = this.state;
    //   const chainId = await web3.eth.chainId();
    //   await this.setState({ chainId, networkId });
    // });
  }

  const totalSupply = () => {
    try {
      contract?.methods
        .totalSupply()
        .call(function (err, res) {
          if (err) {
            console.log("An error occured", err);
            return;
          } else {
            setTotalSupply((totalSupplyState = res));
            console.log(res);
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  const Mint = async () => {
    if (account) {
      console.log("function is calling");
      try {
        await contract?.methods.mintPrice().call(function (err, res) {
            if (err) {
              console.log("An error occured", err);
              return;
            } else {
              setMintPrice((mintPriceState = provider.utils.fromWei(`${res}`)));
              console.log(res);
            }
          })
          console.log(mintPriceState);
          contract.methods.mint(counter).send({
              from: account,
              value: provider.utils.toWei(
                (mintPriceState * counter).toString(),
                "ether"
              ),
            })
            .then(() => {
              setSucccesful(true);
            })
            .catch((e) => {
              console.log(e);
            });
      } catch (e) {
        console.log(e);
      }
    }
  }


  let [counter, setCounter] = useState(1);

  const plus = () => {
    if (counter < 20)
      setCounter(counter + 1)
  }

  const minus = () => {
    if (counter > 1)
      setCounter(counter - 1)
  }


  return (
    <div className="mainDiv">
      <div className="buttons">
        <button className="connectBtn"><NavLink to="Claim_Coin">Claim</NavLink> </button>
        <button onClick={() => loadWeb3()} className="connectBtn">
          {connected ? `${account.substring(0, 4)}...${account.substring(account.length - 3, account.length)}` : "CONNECT WALLET"}
        </button>
      </div>
      <img
        src={require("./images/logo.png")}
        className="mainLogo"
        alt="image_not_found"
      />

      <div className="counter">
        <div className="minus" onClick={minus}><i class="fa-solid fa-minus"></i></div> <div className="count"> <span>{counter}</span></div>
        <div className="plus" onClick={plus} ><i class="fa-solid fa-plus"></i></div>
      </div>

      {
        totalSupplyState > 5000 ?
          <div>
            <button className="connectBtn"><NavLink to="Claim_Coin">🍌Claim🍌</NavLink> </button>
            <div className="error mt-3 ">
              <p className="errorMsg text-center"> <a href="#">Minting</a> Closed! <br /></p>
            </div>
          </div>
          :
          <div>
            <button onClick={
              () => {
                Mint()
              }
            } className="mintBtn">Mint</button>
            {
              successful &&
              <div className="error mt-3 ">
                <p className="errorMsg text-center"> <a href="#">Transaction</a> successful! <br /> you have minted the maximum for this price</p>
              </div>
            }
          </div>
      }

      <div className="error hide mt-3">
        <p className="errorMsg text-center">unfortunately, you are not on the pre-sale list. <br /> please wait for public mint</p>
      </div>

      <div className="error">
        <h2 className="errorMsg text-center">{totalSupplyState}/10000</h2>
      </div>

    </div>
  )
}

export default Main