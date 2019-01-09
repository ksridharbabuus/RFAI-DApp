import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { DrizzleProvider } from 'drizzle-react'

// Layouts
import App from './App'
import { LoadingContainer } from 'drizzle-react-components'

import { history, store } from './store'
import drizzleOptions from './drizzleOptions'

/*
import getWeb3 from './util/web3/getWeb3';

let Contract = require("truffle-contract");
let TokenAbi = require("singularitynet-token-contracts/abi/SingularityNetToken.json");
let TokenNetworks = require("singularitynet-token-contracts/networks/SingularityNetToken.json");
let TokenBytecode = require("singularitynet-token-contracts/bytecode/SingularityNetToken.json");
let Token = Contract({contractName: "SingularityNetToken", abi: TokenAbi, networks: TokenNetworks, bytecode: TokenBytecode});

let SingularityNetTokenAddress = '0x5dce7110a8cb2718a1d96fb8be8915fdf22786e5';

getWeb3.then(function(res) {

  var web3 = res;

  console.log("Indexjs Web3..." + web3 + "---" + this.context.drizzle.web3);
  console.log("Indexjs Web3 Eth..." + this.context.drizzle.web3.eth);

  var contractConfig = {
    contractName: "SingularityNetToken",
    web3Contract: new this.context.drizzle.web3.eth.Contract(TokenAbi, SingularityNetTokenAddress, {data: TokenBytecode })
  }
  var events = ['Mint']
  // Using an action
  //dispatch({type: 'ADD_CONTRACT', drizzle, contractConfig, events, web3})

  // Or using the Drizzle context object
  this.context.drizzle.addContract(contractConfig, events);

});
*/
ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <Router history={history} store={store}>
          <Route exact path="/" component={App} />
        </Router>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
