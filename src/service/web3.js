
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const rpc = "https://eth-mainnet.public.blastapi.io";
const chainID = 1;

export let web3 = new Web3(rpc);
export const connectAccount = async () => {

    try {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    bridge: "https://bridge.walletconnect.org",
                    // network: "Fantom", 
                    // chainid: 0xfa2,
                    // chainId:0xfa2,
                    chainid: chainID,
                    rpc: {
                        // 0xfa2: "https://rpc.testnet.fantom.network/", 
                        1:rpc,
                    },
                }
            },
        };
        const web3Modal = new Web3Modal({
            // network: "fantom",
            cacheProvider: false, // optional
            providerOptions, // required
            disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        });

        console.log("web3Modal instance is", web3Modal);
        const provider = await web3Modal.connect();
        web3 = new Web3(provider)
        console.log("Web3 instance is", web3, provider);
        const chainid = await web3.eth.getChainId();
        console.log(chainid);
        if(chainid != chainID) return alert( "Please connect with FTM Mainnet!")
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        console.log("provider",await provider,await provider.connected);
        // store.dispatch(setMetamaskAddress(accounts[0]))
        // getUserWallet(accounts[0])
        console.log("Connected",accounts[0])
        if(accounts[0]) alert("wallet connected successfully!")
        provider.on("accountsChanged", (accounts) => {
            // store.dispatch(setMetamaskAddress(accounts[0]))
            // getUserWallet(accounts[0])
            console.log("Connected to ",accounts[0])
        });
    } catch (error) {
        alert(error.message)
    }
}