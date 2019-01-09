import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { ContractData } from 'drizzle-react-components'

//components
import Paper from '@material-ui/core/Paper'

//inline styles
const styles = {
    backgroundColor: '#F9DBDB',
    padding: 20
}

class TokenAllowance extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

  }

  fromWei(weiValue) {
    var factor = Math.pow(10, 10)
    var balance = this.context.drizzle.web3.utils.fromWei(weiValue)
    balance = Math.round(balance / factor);
    return balance
  }

  render() {
    
    var allowanceBalance = this.fromWei(this.contracts.SingularityNetToken.methods["allowance"].cacheCall(this.props.accounts[0], this.props.tknSpender));
    return (
      <div>
        <Paper style={styles} elevation={5} >
        <h2>Token Allowances for the contract address {this.props.tknSpender}</h2>
        <p>
          <strong>Allowance Balance: </strong> 
          <ContractData contract="SingularityNetToken" method="allowance" methodArgs={[this.props.accounts[0], this.props.tknSpender]}/> 
          {/* this.props.tknBalance */} AGI
        </p>
        <p>Converted Allowance Balance {allowanceBalance}</p>
        <br/>
      </Paper>
      </div>
    )

  }
}


TokenAllowance.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    SimpleStorage: state.contracts.SimpleStorage,
    TutorialToken: state.contracts.TutorialToken,
    SingularityNetToken: state.contracts.SingularityNetToken,
    ServiceRequest: state.contracts.ServiceRequest,
    drizzleStatus: state.drizzleStatus,
    transactionStack: state.transactionStack,
    transactions: state.transactions
  }
}

export default drizzleConnect(TokenAllowance, mapStateToProps)