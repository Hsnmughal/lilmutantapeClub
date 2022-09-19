import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import LMACAbi from "./Abis/lmac.json";
import tokenAbi from "./Abis/lilBanana.json";
import LBACAbi from "./Abis/lbac.json";

const Staking = () => {
  let [ChainId, setChainId] = useState();
  let [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [LMAC, setLMAC] = useState();
  const [token, setToken] = useState();
  const [LBAC, setLBAC] = useState();
  const LBACAddress = "0x38FDaA767510bDF6F3DDc120BC3fAD98F2bf76c7";
  const LMACAddress = "0x1448A9Cd7ecF26f4f19Ea39e7BFE175987c180D3";
  const tokenAddress = "0xaC40f4753A3f59a0AB6a56b50eB91B42163B7A98";
  const [connected, setConnected] = useState(false);
  let [mintPriceState, setMintPrice] = useState(0);
  let [claimedState, setClaimed] = useState(0);
  let [LBACSupply, setLBACSupply] = useState(0);
  let [pendingRewardsState, setPendingRewards] = useState(0);
  let [lilBananaBal, setLilBananaBal] = useState(0);
  let [LBACBalState, setLBACBal] = useState(0);

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
    const contract1 = new web3.eth.Contract(LMACAbi.abi, LMACAddress);
    const contract2 = new web3.eth.Contract(LBACAbi.abi, LBACAddress);
    const token = new web3.eth.Contract(tokenAbi.abi, tokenAddress);
    setToken(token);
    setLMAC(contract1);
    setLBAC(contract2);
    // console.log(contract);
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
      if (account) {
        claimed();
        pendingRewards();
        LBACholdersSupply();
        LBACBal();
        lilBananaBalance();
      }
    } catch (e) {
      console.log(e);
    }
  }, [LMAC, LBAC, account]);

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

  const claimed = () => {
    try {
      LMAC?.methods
        .claimingDetails(account)
        .call(function (err, res) {
          if (err) {
            console.log("An error occured", err);
            return;
          } else {
            setClaimed((claimedState = provider.utils.fromWei(`${res.claimed}`)));
            console.log(res);
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  const LBACholdersSupply = () => {
    try {
      LMAC?.methods
        .LBACHoldersSupply(account)
        .call(function (err, res) {
          if (err) {
            console.log("An error occured", err);
            return;
          } else {
            setLBACSupply((LBACSupply = res));
            console.log(res);
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  const LBACBal = () => {
    try {
      LBAC?.methods
        .balanceOf(account)
        .call(function (err, res) {
          if (err) {
            console.log("An error occured", err);
            return;
          } else {
            setLBACBal(LBACBalState = res);
            console.log(res);
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  const claimLMACForLBAC = async () => {
    if (account) {
      try {
        await LMAC?.methods
          .LBACHoldersMintPrice()
          .call(function (err, res) {
            if (err) {
              console.log("An error occured", err);
              return;
            } else {
              setMintPrice((mintPriceState = provider.utils.fromWei(`${res}`)));
              console.log(res);
            }
          })
          .then(async () => {
            console.log(mintPriceState);
            await LMAC?.methods
              .mint(LBACBalState)
              .send({
                from: account,
                value: provider.utils.toWei(
                  (mintPriceState * LBACBalState).toString(),
                  "ether"
                ),
              })
              .then(() => {
                LBACholdersSupply();
                alert("Minting Successful");
              })
              .catch((e) => {
                console.log(e);
              });
          });
      } catch (e) {
        console.log(e)
      }
    }
  }

  const claimNana = async () => {
    if (account) {
      try {
        LMAC?.methods.claim().send({
          from: account
        }).then(() => {
          lilBananaBalance();
          claimed();
          pendingRewards();
          alert("Successfully Claimed!")
        }).catch(e => {
          console.log(e);
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  const lilBananaBalance = () => {
    try {
      token?.methods
        .balanceOf(account)
        .call(function (err, res) {
          if (err) {
            console.log("An error occured", err);
            return;
          } else {
            setLilBananaBal((lilBananaBal = provider.utils.fromWei(`${res}`)));
            console.log(res);
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  const pendingRewards = () => {
    try {
      LMAC?.methods
        .pendingRewards()
        .call(function (err, res) {
          if (err) {
            console.log("An error occured", err);
            return;
          } else {
            setPendingRewards((pendingRewardsState = res));
            console.log(res);
          }
        })
    } catch (e) {
      console.log(e)
    }
  }

  return (




    <div className="Stacking" id="stacking">
      <div className="container">
        <div className="row">

          <div className="col-md-10 mx-auto">


            <div className="innerDiv">
              <a href="#">
                <div className="stackingLogo">
                  <span>
                    <img src={require("./images/logo.png")} alt="Logo" />
                  </span>
                  {/* <h2 className="white stacking">Lil Mutant Ape Club</h2> */}
                  <h4 className="white mt-4"></h4>
                </div>
              </a>




              <div className="d-flex justify-content-center mt-5">
                <button onClick={() => loadWeb3()} className="connectWallet">
                  {connected ? `${account.substring(0, 4)}...${account.substring(account.length - 3, account.length)}` : "CONNECT WALLET"}
                </button>
              </div>

              <div className="stackingContent text-center">
                <p className="para text-center mt-5 mb-1">
                </p>
                {
                  !connected &&
                  <h4 className="white walletTxt">Connect Wallet First!</h4>
                }

                <p className="para text-center mt-5 pt-4 mb-1 bold">Your LBAC's</p>
                <h4 className="white walletTxt">{LBACBalState}</h4>

                <p className="para text-center mt-4 mb-1 bold">Claimed</p>
                <h4 className="white walletTxt">{LBACSupply}</h4>


                <p className="para text-center mt-4 mb-1 bold">Your Pending LMAC</p>
                <h4 className="white walletTxt">{LBACBalState - LBACSupply}</h4>

                <div className="d-flex justify-content-center mt-5 pt-3">
                  <button onClick={() => claimLMACForLBAC()} className="connectWallet">Claim LMAC</button>
                </div>
              </div>






              <div className="stackingContent text-center">
                <p className="para text-center mt-5 mb-1">
                </p>


                <p className="para text-center mt-5 pt-4 mb-1">Your $LILBANANA</p>
                <h4 className="white walletTxt">{lilBananaBal}</h4>

                <p className="para text-center mt-4 mb-1">Claimed</p>
                <h4 className="white walletTxt">{claimedState}</h4>


                <p className="para text-center mt-4 mb-1">Your Pending $Lilbanana</p>
                <h4 className="white walletTxt">{pendingRewardsState}</h4>

                <div className="d-flex justify-content-center mt-5 pt-3">
                  <button onClick={() => claimNana()} className="connectWallet">Claim $Lilbanana</button>
                </div>
              </div>




              <div className="stackingFooter d-none d-md-flex">
                <button className="connectWallet">OPENSEA</button>

                <span className="white mt-4">Lil Mutant Ape Club Contract: <a href="#">0x918f677b3ab4b9290ca96a95430fd228b2d84817</a> </span>

                <span className="white">Lil Banana Contract: <a href="#">0x0ddf1dac8537c90b0a96bdf05a8c9ed78ccd26ca</a> </span>
              </div>


              <div className="stackingFooter d-flex d-md-none">
                <button className="connectWallet">OPENSEA</button>

                <span className="white mt-4">Lil Mutant Ape Club Contract: <a href="#">0x918f ...</a> </span>

                <span className="white">Lil Banana Contract: <a href="#">0x0ddf1  ...</a> </span>
              </div>



            </div>




          </div>
        </div>




      </div>
    </div>
  );
};

export default Staking;
