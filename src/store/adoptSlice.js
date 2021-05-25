import Web3 from 'web3'

import {Token} from '../deployed/Token'
import {Faucet} from '../deployed/Faucet'


const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");




export const initWeb3 = createAsyncThunk(
    "InitWeb3",
    async(a,thunkApi)=>{
        //console.log(" init web3 called ")
        
        try {
            if(Web3.givenProvider){
                const web3 = new Web3(Web3.givenProvider);
                await Web3.givenProvider.enable()
                const networkId = await web3.eth.net.getId()
                 const TokenAddress = "0x32AC5eddFD89Ba88434d64D66D993cc8ADcc4C55"
                const FaucetAddress = "0xe04511c03ca4e42331466ad4789a7422ca35e6dd"
                 var TokenContract = new web3.eth.Contract(Token, TokenAddress);
                var FaucetContract = new web3.eth.Contract(Faucet, FaucetAddress);
                const addresses = await web3.eth.getAccounts()
                var balance = await web3.eth.getBalance(addresses[0])
                var address = addresses[0];
                thunkApi.dispatch(balanceOfYearly({
                    TokenContract,
                    address,
                    FaucetContract,
                    
                }))

                return {
                    web3,
                    balance,
                    TokenContract,
                    FaucetContract,
                    networkId,
                    address : addresses[0],
                                   }
            }else {console.log("error in loading web3")}    
        } catch (error) {
            console.log("Error", error)
        }
        
    }
)


export const balanceOfYearly = createAsyncThunk("balanceOfYearly", 
    async ({TokenContract,
        address,
        FaucetContract,})=>{
        try {
            //const cacheTime = await contract.methods.stakeTime(address).call()
            const arrayResult = await TokenContract.methods.balanceOf(address).call()
            //const faucetBalance = null
            const faucetBalance = await TokenContract.methods.balanceOf(FaucetContract._address).call()
            const lastAccessTime = await FaucetContract.methods.lastAccessTime(address).call()
            console.log("faucet address",FaucetContract._address)
         
            return {arrayResult,lastAccessTime,faucetBalance}
            
        } catch (error) {
            console.log("Error in ArrayThunk",error)
        }
    }
    )
   
    
// export const MonthlyWithdraw = createAsyncThunk("YearlyWithdraw", 
//     async ({MstackValue,YOLOMonthly,sender})=>{
//         try {
            
//             const result = await YOLOMonthly.methods.withdraw(MstackValue).send({from : sender})
//             return result;
            
//         } catch (error) {
//             console.log("Error in sendDataThunk",error)
//         }
//     }
//     )
    
    export const faucetCall = createAsyncThunk("faucetCall", 
    async ({FaucetContract,address})=>{
        try {

           const result = await FaucetContract.methods.requestTokens().send({from : address})
 
          
           return result;
             
        } catch (error) {
            console.log("Error in sendDataThunk",error)
        }
    }
    )






const adoptSlice = createSlice({
    name: "AdopSlice",
    initialState: {
        web3: null,
        balance : null,
        TokenContract: null,
        FaucetContract:null,
        FaucetContractAddress:null,
        address: null,
        balanceOfUser: null,
        networkId : null,
        arrayAwait : false,
        toggle: false,
        lastAccessTime: null,
        faucetBalance: null,
         
    },
    reducers: {
        toggle : (state,actions)=>{
            state.toggle = !state.toggle;
        }
    },
    extraReducers: {
        [initWeb3.fulfilled] : (state,action)=>{
            state.web3 = action.payload.web3;
            state.balance = action.payload.balance;
            state.networkId = action.payload.networkId;
            state.TokenContract = action.payload.TokenContract;
            state.FaucetContract = action.payload.FaucetContract;
            state.address = action.payload.address;
            state.FaucetContractAddress = action.payload.FaucetContract._address;
        
         },
        [balanceOfYearly.fulfilled] : (state,action)=>{
   
            state.balanceOfUser = action.payload.arrayResult/1000000000000000000    
            state.lastAccessTime = action.payload.lastAccessTime
            state.faucetBalance = action.payload.faucetBalance/1000000000000000000
        },


    }
})

export const adopreducer = adoptSlice.reducer;
export const { toggle } = adoptSlice.actions