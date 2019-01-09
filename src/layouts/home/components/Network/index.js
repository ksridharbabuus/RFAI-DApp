import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'


class Network extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.state = { network: ""}
  }

  componentDidMount() {
    this.getNetwork()
  }

  componentDidUpdate(prevProps) {
    // Commented by Sridhar
    //if (this.props.TokenShop !== prevProps.TokenShop) {
    //    this.getNetwork()
    //}
  }

  getNetwork() {
    var net
    if (this.props.drizzleStatus.initialized) {
      this.context.drizzle.web3.eth.net.getId().then(result => {
        net = result
      })
      .then(() =>{
        switch (net) {
          default:
          this.setState({network: "Can't determine network, might be connected to localhost:8545"})
          break
          case 1:
          this.setState({network: "Mainnet"})
          break
          case 3:
          this.setState({network: "Ropsten"})
          break
          case 4:
          this.setState({network: "Rinkeby"})
          break
          case 42:
          this.setState({network: "Kovan"})
          break
        }
      })
    }
  }

  render() {

    return (
      <div>
        {this.state.network} <p>Account: {this.props.accounts[0]} </p>
      </div>
    )

  }
}

Network.contextTypes = {
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

export default drizzleConnect(Network, mapStateToProps)