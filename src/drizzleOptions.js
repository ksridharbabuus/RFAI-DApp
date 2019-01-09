import ComplexStorage from './../build/contracts/ComplexStorage.json'
import SimpleStorage from './../build/contracts/SimpleStorage.json'
import TutorialToken from './../build/contracts/TutorialToken.json'
import SingularityNetToken from './../build/contracts/SingularityNetToken.json'
import ServiceRequest from './../build/contracts/ServiceRequest.json'
//import web3 from './util/web3/getWeb3'
/*
let Contract = require("truffle-contract");
let TokenAbi = require("singularitynet-token-contracts/abi/SingularityNetToken.json");
let TokenNetworks = require("singularitynet-token-contracts/networks/SingularityNetToken.json");
let TokenBytecode = require("singularitynet-token-contracts/bytecode/SingularityNetToken.json");
let Token = Contract({contractName: "SingularityNetToken", abi: TokenAbi, networks: TokenNetworks, bytecode: TokenBytecode});

let SingularityNetTokenAddress = '0x5dce7110a8cb2718a1d96fb8be8915fdf22786e5';
*/

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    ComplexStorage,
    SimpleStorage,
    TutorialToken,
    SingularityNetToken,
    ServiceRequest/*, 
    {
      contractName: 'SingularityNetToken',
      web3Contract: new web3.eth.Contract(TokenAbi, SingularityNetTokenAddress, {data: TokenBytecode }) // An instance of a Web3 contract
    }*/
  ],
  events: {
    SimpleStorage: ['StorageSet'],
    AddFoundationMember: ['AddFoundationMember'], 
    CreateRequest: ['CreateRequest'], 
    ExtendRequest : ['ExtendRequest'], 
    ApproveRequest: ['ApproveRequest'], 
    FundRequest: ['FundRequest'], 
    AddSolutionRequest: ['AddSolutionRequest'], 
    VoteRequest: ['VoteRequest'], 
    ClaimRequest: ['ClaimRequest'], 
    CloseRequest: ['CloseRequest'], 
    RejectRequest: ['RejectRequest']
  },
  polls: {
    accounts: 1500
  }
}

/*
var contractConfig = {
  contractName: "SingularityNetToken",
  web3Contract: new web3.eth.Contract(TokenAbi, SingularityNetTokenAddress, {data: TokenBytecode })
}
var events = ['Mint']

// Using an action
//dispatch({type: 'ADD_CONTRACT', drizzle, contractConfig, events, web3})

// Or using the Drizzle context object
this.context.drizzle.addContract(contractConfig, events)
*/

export default drizzleOptions