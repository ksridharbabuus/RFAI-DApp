import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../logo.png'

// import components
import Network from './components/Network'
import Account from './components/Account'
import TransferToken from './components/TransferToken'
import TokenAllowance from './components/TokenAllowance'
import ApproveToken from './components/ApproveToken'
import DepositToken from './components/DepositToken'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Network</h1>
            <p><Network /></p>
            <h1>Drizzle Examples</h1>
            <p>Examples of how to get started with Drizzle in various situations.</p>

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <Account tknBalance="0" />
          </div>
          <br/><br/>

          <div className="pure-u-1-1">
            <TransferToken tknBalance="100000000000000000" />
          </div>

          <br /><br />
          <div className="pure-u-1-1">
            {/* Needs to replace hard coded value with the actual RFAI Smart Contract Address */}
            <TokenAllowance tknSpender="0xcc8b8a9a37f1710fc5db77a3797021cf1fe98f54" />
          </div>

          <br /><br />
          <div className="pure-u-1-1">
            {/* Needs to replace hard coded value with the actual RFAI Smart Contract Address */}
            <ApproveToken tknSpender="0xcc8b8a9a37f1710fc5db77a3797021cf1fe98f54" />
          </div>
          
          <br /><br />
          <div className="pure-u-1-1">
            {/* Needs to replace hard coded value with the actual RFAI Smart Contract Address */}
            <DepositToken tknSpender="0xcc8b8a9a37f1710fc5db77a3797021cf1fe98f54" tknBalance="100000000000000000" allowanceBalance="1000000000"/>
          </div>

          <h1>Following are the Hardcoded components</h1>

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>SimpleStorage</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
            <p><strong>Stored Value</strong>: <ContractData contract="SimpleStorage" method="storedData" /></p>
            <ContractForm contract="SimpleStorage" method="set" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>TutorialToken</h2>
            <p>Here we have a form with custom, friendly labels. Also note the token symbol will not display a loading indicator. We've suppressed it with the <code>hideIndicator</code> prop because we know this variable is constant.</p>
            <p><strong>Total Supply</strong>: <ContractData contract="TutorialToken" method="totalSupply" methodArgs={[{from: this.props.accounts[0]}]} /> <ContractData contract="TutorialToken" method="symbol" hideIndicator /></p>
            <p><strong>My Balance</strong>: <ContractData contract="TutorialToken" method="balanceOf" methodArgs={[this.props.accounts[0]]} /></p>
            <h3>Send Tokens</h3>
            <ContractForm contract="TutorialToken" method="transfer" labels={['To Address', 'Amount to Send']} />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>ComplexStorage</h2>
            <p>Finally this contract shows data types with additional considerations. Note in the code the strings below are converted from bytes to UTF-8 strings and the device data struct is iterated as a list.</p>
            <p><strong>String 1</strong>: <ContractData contract="ComplexStorage" method="string1" toUtf8 /></p>
            <p><strong>String 2</strong>: <ContractData contract="ComplexStorage" method="string2" toUtf8 /></p>
            <strong>Single Device Data</strong>: <ContractData contract="ComplexStorage" method="singleDD" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Existing Singularity Net Token Contract</h2>
            <p>Existing Singularity Net Token Contract to get balance and to approve allowances to RFAI Contract...</p>
            <p><strong>Singularity Net Token Balance for the account: </strong>: 
            <ContractData contract="SingularityNetToken" units="8" method="balanceOf" methodArgs={[this.props.accounts[0]]}/></p>
            <br/><br/>

            <p><strong>Current Allowance: </strong>:</p>
            <ContractData contract="SingularityNetToken" method="allowance" methodArgs={[this.props.accounts[0], '0xe924701d263e290a36c35814637c796de69bdd9e']}/>

            <br/><br/>
            <p><strong>Approve Token: </strong>:</p>
            <ContractForm contract="SingularityNetToken" method="approve" labels={['Contract Address', 'Amount']} />

          </div>


          <div className="pure-u-1-1">
            <h2>RFAI Portal Contract</h2>
            <p>RFAI Portal Contract Method Samples. Needs to add it to the appropriate places...</p>
            <p><strong>Singularity Net Token Address...</strong>: <ContractData contract="ServiceRequest" method="token"/></p>
            <p><strong>Singularity Net Token Balance in the Escrow RFAI Contract </strong>: 
            <ContractData contract="ServiceRequest" method="balances" methodArgs={[this.props.accounts[0]]}/></p>
            <br/><br/>
            <p><strong>Add Foundation Members </strong>: </p>
            <ContractForm contract="ServiceRequest" method="addOrUpdateFoundationMembers" labels= {['Account', 'Role', 'Status']} />

            <br/><br/>
            <p><strong>Deposit Singularity Net Tokens to Contract </strong>: </p>
            <ContractForm contract="ServiceRequest" method="deposit" labels={['Amount']} />

            <br/><br/>
            <p><strong>Given account is a foundation member </strong>: </p>
            <ContractData contract="ServiceRequest" method="foundationMembers" methodArgs={[this.props.accounts[0]]}/>
            


          </div>

        </div>
      </main>
    )
  }
}

export default Home
