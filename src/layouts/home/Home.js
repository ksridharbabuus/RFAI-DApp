import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import logo from '../../logo.png'
import PropTypes from 'prop-types'

// import components
import LandingPage from './components/LandingPage'
import RequestList from './components/RequestList'
import RequestListV2 from './components/RequestListV2'
import RequestsTab from './components/RequestsTab'

/* 

// import components
import Network from '../components/Network'
import Account from '../components/Account'
import TransferToken from '../components/TransferToken'
import TokenAllowance from '../components/TokenAllowance'
import ApproveToken from '../components/ApproveToken'
import DepositToken from '../components/DepositToken'
import CreateMember from '../components/CreateMember'
import ContractConfig from '../components/ContractConfig'
import CreateRequest from '../components/CreateRequest'

*/

class Home extends Component {

  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.handleHomeButton = this.handleHomeButton.bind(this)
    this.handleViewRequest = this.handleViewRequest.bind(this)

    this.state = {
      showLandingPage: true,
      showViewPage: false,
      readonly: true
    }

  }

  handleHomeButton() {
    this.setState({ showLandingPage: true, showViewPage: false })
  }

  handleViewRequest() {
    this.setState({ showLandingPage: false, showViewPage: true })
  }

  render() {
    // RequestStatus { 0=Open, 1=Approved, 2=Rejected, 3=Completed, 4=Closed }
    // className="container"
    // (this.state.showLandingPage ? <LandingPage handler={this.handleViewRequest}/> :  <RequestsTab />)

    // <div><RequestListV2 compRequestStatus="0"/> <br/><br/><br/><br/><br/><br/><br/> <RequestList /></div>
    // <RequestsTab />

    return (
      <main >

        {/* Header Design Goes here - For now keeping only the header home button */}
        <a href="#" onClick={this.handleHomeButton}>Home Icon Place Holder</a><br/>
        <a href="#" onClick={this.handleViewRequest}>Request List Page Place Holder</a><br/>
        <LandingPage handlerViewPage={this.handleViewRequest}/>
        {this.state.showViewPage === true && <div class="main-content"><RequestsTab /></div>}

      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home
