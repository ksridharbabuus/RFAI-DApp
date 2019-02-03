import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

//components
import Paper from '@material-ui/core/Paper'

//inline styles
const styles = {
    backgroundColor: 'white',
    padding: 20
}

class ContractConfig extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.state = {
      dialogOpen: false,
      defaultState: false,
      dataKeyMinStake: null,
      dataKeyMaxStakers: null,
      dataKeyNextRequestId: null,
      dataKeyOwner: null,
      minStake: null,
      maxStakers: null,
      nextRequestId: null,
      owner: null,
      alertText: ''
    }
  }

  componentDidMount() {
    // Get the Data Key
    const dataKeyMinStake = this.contracts.ServiceRequest.methods.minStake.cacheCall();
    this.setState({dataKeyMinStake})

    const dataKeyMaxStakers = this.contracts.ServiceRequest.methods.maxStakers.cacheCall();
    this.setState({dataKeyMaxStakers})

    const dataKeyNextRequestId = this.contracts.ServiceRequest.methods.nextRequestId.cacheCall();
    this.setState({dataKeyNextRequestId})

    const dataKeyOwner  = this.contracts.ServiceRequest.methods.owner.cacheCall();
    this.setState({dataKeyOwner})

    this.setContractConfigurations(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps) {
    if (this.props.ServiceRequest !== prevProps.ServiceRequest) {
        this.setState({ defaultState: false })
        this.setContractConfigurations(this.props.ServiceRequest)
    }
  }

  setContractConfigurations(contract) {

    if (contract.minStake[this.state.dataKeyMinStake] !== undefined && this.state.dataKeyMinStake !== null) {
      this.setState({
        minStake: contract.minStake[this.state.dataKeyMinStake].value
      })
    }

    if (contract.maxStakers[this.state.dataKeyMaxStakers] !== undefined && this.state.dataKeyMaxStakers !== null) {
      this.setState({
        maxStakers: contract.maxStakers[this.state.dataKeyMaxStakers].value
      })
    }
     
    if (contract.nextRequestId[this.state.dataKeyNextRequestId] !== undefined && this.state.dataKeyNextRequestId !== null) {
      this.setState({
        nextRequestId: contract.nextRequestId[this.state.dataKeyNextRequestId].value
      })
    }

    if (contract.owner[this.state.dataKeyOwner] !== undefined && this.state.dataKeyOwner !== null) {
      this.setState({
        owner: contract.owner[this.state.dataKeyOwner].value
      })
    }
  }

  render() {
 
    return (
      <div>
        <Paper style={styles} elevation={5}>

          <p><strong>RFAI Contract Configurations: </strong></p>
          <form className="pure-form pure-form-stacked">
            <label>Minimum Stake: </label> {this.state.minStake} <br/>
            <label>Maximum Stakers: </label> {this.state.maxStakers} <br />
            <label>Owner: </label> {this.state.owner} <br />
            <label>Number of Requests : </label> {this.state.nextRequestId}
          </form>
        </Paper>

      </div>
    )
  }
}

ContractConfig.contextTypes = {
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
export default drizzleConnect(ContractConfig, mapStateToProps)