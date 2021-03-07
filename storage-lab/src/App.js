import React, { useState, useEffect } from "react";
import { simpleStorage} from "./abi/abi";
import Web3 from "web3";
import Nav from "./components/Nav.js";
import './App.css';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x3cd9Dd68F6B86586970Fd9a25999b5fC7832F0d5" // pulled from abi.js from the 'address' field
const storageContract = new web3.eth.Contract(simpleStorage, contractAddress);

const useStyles = makeStyles((theme) => ({
  // manipulate the styling of buttons and text fiels 
  root: {
    "& > *": {
      margin: theme.spacing(1),
    }
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}))

function App() {
  const classes = useStyles();
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalance, setAccountBalance] = useState('0')
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("0"); // will hold unit256

  const numberSet = async(t) => {
    t.preventDefault();
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
      const accounts = await window.ethereum.enable(); // this opens up metamask 
      // const accounts = await web3.eth.getAccounts()
      const account = accounts[0]; 
      const accountBalance = await web3.eth.getBalance(account);

      setAccountAddress(account)
      setAccountBalance(accountBalance)
    }

    fetchAccountInfo();
    
  }, [])

  const bull = <span className={classes.bullet}>•</span>;

  return (
    <>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="h2">
          Address: <p> {accountAddress}</p>
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
    <div className={classes.root}>
     <div className="main">
       <div className="card">
          <Nav />
         <TextField
           id="outlined-basic"
           label="Set your uint256:"
           onChange={(t) => setUint(t.target.value)}
           variant="outlined"
         />
         <form className="form" onSubmit={numberSet}>
           <Button
             variant="contained"
             color="primary"
             type="submit"
             value="Confirm"
           >
             Confirm
           </Button>
           <br />
           <Button
             variant="contained"
             color="secondary"
             onClick={numberGet}
             type="button"
           >
             Get your uint256
           </Button>
           {getNumber}
         </form>
       </div>
     </div>
   </div>
    <div className="App">
      <div className="card">
        <p>Your connected account address: {accountAddress}</p>
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
    </>
  );
}

export default App;
