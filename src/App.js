import React,{useState, useEffect} from 'react';
import './App.css'
//import Main from "./components/Main/Main";
import { useDispatch, useSelector } from 'react-redux'; 
import { initWeb3,faucetCall,balanceOfYearly } from './store/adoptSlice';
import ReCaptchaV2 from 'react-google-recaptcha'
import Timer from './Timer'
// import { isBot, useProgressiveImage } from "./helpers";
//import axios from 'axios'

function App() {

  
  
//  const loading = !headerImage || !footerImage || !middleImage;
  const [price, setPrice] = useState()
  
  const dispatch = useDispatch()
  
  const balance = useSelector((state)=>{
      return (state.adoptReducer.balance/1000000000000000000).toFixed(4)
   })



const tokenBalance = useSelector((state)=>{
    return state.adoptReducer.balanceOfUser
 })

const faucetBalance = useSelector((state)=>{
  return state.adoptReducer.faucetBalance
})


const address = useSelector((state)=>{
    return state.adoptReducer.address
 })

   const networkId = useSelector((state)=>{
    return state.adoptReducer.networkId
 })

   const toggle = useSelector((state)=>{
    return state.adoptReducer.toggle
  })

  const FaucetContract = useSelector((state)=>{
    return state.adoptReducer.FaucetContract
   })

  const lastAccessTime = useSelector((state)=>{
    return state.adoptReducer.lastAccessTime
   })

   console.log('balance of year',lastAccessTime)

  var currentTime = new Date().getTime() / 1000



  useEffect(() => {
    
    dispatch(initWeb3())
    setInterval(() => {

      dispatch(initWeb3())
      dispatch(balanceOfYearly()) 
     }, 1000);
    
     return()=>{}
    
  }, [toggle,address])

  const setfaucetCall = (e)=>{
    e.preventDefault()
        dispatch(faucetCall({FaucetContract,address}))
  
  }

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


  return (
    <div>
      	<h1 id="title">Simple Faucet</h1><br/><br/>
        <h2 id="title">Faucet has currently : {faucetBalance && numberWithCommas(faucetBalance)} Tokens</h2>
    <div id="description">
		<p id="intro">Welcome to the simple faucet, a minimalistic ERC20-token faucet for Ethereum. Developing dApps or smart contracts requires you to test what you have built. 
		Since begging for tokens face-to-face is outdated, this faucet offers a very easy smart contract based solution. 
		Just click the button below and you will receive some test tokens. The only thing that you need is Metamask.</p>
		{networkId !=3?<div id="wrong_network">It seems that you are <strong>not connected to the testnet</strong>. Please switch to it via Metamask. If you haven't added the testnet already, follow these simple steps:
		<ol>
			<li>Open and unlock your Metamask</li>
			<li>Click on the network selector at the top</li>
			<li>Select "Custom RPC"</li>
			<li>Scroll down to "New Network" and enter the following (enable the advanced options):</li>
			<ul>
				<li>New RPC URL: <span id="rpc_url" class="metamask_info"></span></li>
				<li>ChainID: <span id="network_id" class="metamask_info"></span></li>
				<li>Nickname: <span class="metamask_info">MyFancyTestnet</span></li>
			</ul>
			<li>Click on save and you're done!</li>
		</ol>
	  </div>:
    <div>
    <div ><strong>You are connected to the right testnet - great!{'      '}</strong>Go ahead and claim some tokens!</div>
    <div id="faucet">
    <h2>Your Address:</h2>
    <div id="address">{address}</div>

    <h2>Your Ether Balance:</h2>
    <div id="balanceETH">{balance}</div>

    <h2>Your Token Balance:</h2>
    <div id="balanceToken">{tokenBalance && numberWithCommas(tokenBalance)}</div>
    {currentTime > lastAccessTime? <button id="requestButton" type="button" class="btn btn-primary"
    onClick={setfaucetCall}
    >Request Test Tokens</button>: 
    <div id="warning">
      <br/> 
    <strong>you have already received token</strong><br/><br/>
    You will be eligible for token in <br/><br/>
    <Timer stakeTime = {lastAccessTime}></Timer></div>
    }
    
    </div>
    </div>}
	  
    </div>
    </div>
    );
}

export default App;