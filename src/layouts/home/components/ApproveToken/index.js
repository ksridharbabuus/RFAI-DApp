import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import web3 from 'web3'

//components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'

//inline styles
const styles = {
    backgroundColor: 'white',
    padding: 20
}

const dialogStyles = {
  style: {
    backgroundColor: '#F9DBDB',
    padding: 20
  }
}

const BN = web3.utils.BN

class ApproveToken extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.handleAmountInputChange = this.handleAmountInputChange.bind(this)
    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleApproveButton = this.handleApproveButton.bind(this)
    this.setTXParamValue = this.setTXParamValue.bind(this)

    // this.props.tknSpender
    this.state = {
      spenderAddress: this.contracts.ServiceRequest.address,
      dataKeyTokenAllowance: null,
      tknAllowance: 0,
      approveAmount: '',
      dialogOpen: false,
      alertText: ''
    }

  }

  componentDidMount() {
    const dataKeyTokenAllowance = this.contracts.SingularityNetToken.methods["allowance"].cacheCall(this.props.accounts[0], this.state.spenderAddress);
    this.setState({dataKeyTokenAllowance})
    this.setTokenAllowance(this.props.SingularityNetToken)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.SingularityNetToken !== prevProps.SingularityNetToken || this.state.dataKeyTokenAllowance !== prevState.dataKeyTokenAllowance) {
        this.setTokenAllowance(this.props.SingularityNetToken)
    }
  }

  setTokenAllowance(contract) {
    if (contract.allowance[this.state.dataKeyTokenAllowance] !== undefined && this.state.dataKeyTokenAllowance !== null) {
console.log("contract.allowance[this.state.dataKeyTokenAllowance].value - " + contract.allowance[this.state.dataKeyTokenAllowance].value)      
      this.setState({
        tknAllowance: contract.allowance[this.state.dataKeyTokenAllowance].value
      })
    }
  }


  handleAmountInputChange(event) {
    if (event.target.value.match(/^[0-9]{1,40}$/)) {
      var amount = new BN(event.target.value)
      if (amount.gte(0)) {
        this.setState({ [event.target.name]: amount.toString() })
        this.setTXParamValue(amount)
      } else {
        this.setState({ [event.target.name]: '' })
        this.setTXParamValue(0)
      }
    } else {
        this.setState({ [event.target.name]: '' })
        this.setTXParamValue(0)
      }
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false })
  }

  handleApproveButton() {
    var amountBN = new BN(this.state.approveAmount)

    if(amountBN.gt(0)) {
      this.contracts.SingularityNetToken.methods["approve"].cacheSend(this.state.spenderAddress, this.state.approveAmount, {from: this.props.accounts[0]})
    } else {
      this.setState({ alertText: 'Oops! Something went wrong. Try checking your transaction details.'})
      this.handleDialogOpen()
    }
  }

  setTXParamValue(_value) {
    if (web3.utils.isBN(_value)) {
      this.setState({
        approveAmount: _value.toString()
      })
    } else {
      this.setState({
        approveAmount: ''
      })
    }
  }

  // groomWei(weiValue) {
  //   var factor = Math.pow(10, 8)
  //   var balance = this.context.drizzle.web3.utils.fromWei(weiValue)
  //   balance = Math.round(balance * factor) / factor
  //   return balance
  // }

  render() {
    // var approveGroomed = this.groomWei(this.state.approveAmount)

    return (
      <div>
        <Paper style={styles} elevation={5}>
          <p><strong>Approve Tokens to spend by RFAI Escrow Contract </strong></p>

          <form className="pure-form pure-form-stacked">
            <p>Approved allowance: {this.state.tknAllowance} AGI</p><br></br>
            <input name="approveAmount" type="text" placeholder="Tokens to Approve:" value={this.state.approveAmount} onChange={this.handleAmountInputChange} /> <br/><br/><br/>
            <Button type="Button" variant="contained" onClick={this.handleApproveButton}>Approve</Button>
          </form>
          {/* <p>Tokens to approve: {approveGroomed} </p> */}
      </Paper>

      <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
        <p>{this.state.alertText}</p>
        <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
      </Dialog>
      </div>
    )
  }
}

ApproveToken.contextTypes = {
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
export default drizzleConnect(ApproveToken, mapStateToProps)