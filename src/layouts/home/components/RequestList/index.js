import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../../../logo.png'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

// import components
import Network from '../../components/Network'
import Account from '../../components/Account'
import TransferToken from '../../components/TransferToken'
import TokenAllowance from '../../components/TokenAllowance'
import ApproveToken from '../../components/ApproveToken'
import DepositToken from '../../components/DepositToken'
import CreateMember from '../../components/CreateMember'
import ContractConfig from '../../components/ContractConfig'
import CreateRequest from '../../components/CreateRequest'


class RequestList extends Component {
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1-1">
          <h2>Account Details</h2>
          <Account tknBalance="0" />
        </div>
        <br/><br/>

        <div className="pure-u-1-1">
          <h2>Transfer Token</h2>
          <TransferToken tknBalance="100000000000000000" />
        </div>

        <br /><br />
        <div className="pure-u-1-1">
          <h2>Token Allowance</h2>
          <TokenAllowance />
        </div>

        <br /><br />
        <div className="pure-u-1-1">
          <h2>Approve Token</h2>
          <ApproveToken />
        </div>
        
        <br /><br />
        <div className="pure-u-1-1">
          <h2>Deposit Token</h2>
          <DepositToken tknBalance="100000000000000000" allowanceBalance="1000000000"/>
        </div>

        
        <br /><br />
        <div className="pure-u-1-1">
          <h2>Create Member</h2>
          <CreateMember />
        </div>


        <br /><br />
        <div className="pure-u-1-1">
          <h2>Contract Configurations</h2>
          <ContractConfig />
        </div>

        <br /><br />
        <div className="pure-u-1-1">
          <h2>Create Request</h2>
          <CreateRequest />
        </div>
        
      </div>

    )
  }
}

RequestList.contextTypes = {
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

export default drizzleConnect(RequestList, mapStateToProps)
