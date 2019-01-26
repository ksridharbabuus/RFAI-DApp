import React, { Component } from 'react'
import logo from '../../../../logo.png'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

// import components
import Network from '../../components/Network'

class LandingPage extends Component {
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Network</h1>
            <p><Network /></p>
            <h1>RFAI Portal</h1>
            <p>RFAI Portal Description Goes Here.<br/>RFAI Portal Description Goes Here.<br/>RFAI Portal Description Goes Here.</p>
            <br/><br/>
        </div>
      </div>
    )
  }
}

LandingPage.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    SingularityNetToken: state.contracts.SingularityNetToken,
    ServiceRequest: state.contracts.ServiceRequest,
    drizzleStatus: state.drizzleStatus,
    transactionStack: state.transactionStack,
    transactions: state.transactions
  }
}

export default drizzleConnect(LandingPage, mapStateToProps)
