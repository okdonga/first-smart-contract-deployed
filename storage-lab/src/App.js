import React, { useState, useEffect } from "react";
import { simpleStorage} from "./abi/abi";
import Web3 from "web3";
import './App.css';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x3cd9Dd68F6B86586970Fd9a25999b5fC7832F0d5" // pulled from abi.js from the 'address' field
const storageContract = new web3.eth.Contract(simpleStorage, contractAddress);
console.log(web3)
console.log(storageContract)
function App() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalance, setAccountBalance] = useState('0')
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("0"); // will hold unit256

  const numberSet = async(t) => {
    t.preventDefault();
    // const accounts = await window.ethereum.enable(); // calling connected address via MetaMask
    // const account = accounts[0]; 
    const gas = await storageContract.methods.set(number).estimateGas();
    console.log(`gas:${gas}`)
    const post = await storageContract.methods.set(number).send({
      from: accountAddress,
      gas,
    })

    const accountBalance = await web3.eth.getBalance(accountAddress);
    setAccountBalance(accountBalance);
    console.log(`post:${post}`)
  }

  const numberGet = async(t) => {
    t.preventDefault();
    const post = await storageContract.methods.get().call();
    setGet(post);
  }

  useEffect(() => {
    async function fetchAccountInfo() {
      // const accounts = await window.ethereum.enable(); 
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]; 
      const accountBalance = await web3.eth.getBalance(account);

      setAccountAddress(account)
      setAccountBalance(accountBalance)
    }

    fetchAccountInfo();
    
  }, [])

  return (
    <div className="App">
      <div className="card">
        <p>Your account: {accountAddress}</p>
        <p>Balance: {accountBalance} wei / {Web3.utils.fromWei(accountBalance, 'ether')} ETH</p>
        <p>
          <a href="https://ropsten.etherscan.io/address/0x8bd7cf7ed7991203a7dd8e3a4a6012b9c9e08659">Etherscan</a>
        </p>
        <p>Smart contract address deployed to ropsten network: {contractAddress}</p>
       <form className="form" onSubmit={numberSet}>
         <label>
           Set your uint256:
           <input
             className="input"
             type="text"
             name="name"
             onChange={(t) => setUint(t.target.value)}
           />
         </label>
         <button className="button" type="submit" value="Confirm">
           Confirm
         </button>
       </form>
       <br />
       <button className="button" onClick={numberGet} type="button">
         Get your uint256
       </button>
       {getNumber}
     </div>
    </div>
  );
}

export default App;
