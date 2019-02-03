import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import web3 from 'web3'

//components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
//import InvalidAddressModal from '../InvalidAddressModal'
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

class DepositToken extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.handleAmountInputChange = this.handleAmountInputChange.bind(this)
    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleDepositButton = this.handleDepositButton.bind(this)
    this.setTXParamValue = this.setTXParamValue.bind(this)

    // this.props.tknSpender
    this.state = {
      spenderAddress: this.contracts.ServiceRequest.address,
      depositAmount: '',
      dataKeyTokenBalance: null,
      tknBalance: 0,
      dataKeyTokenAllowance: null,
      tknAllowance: 0,
      dataKeyEscrowBalance: null,
      escrowBalance: 0,
      dialogOpen: false,
      alertText: ''
    }
  }

  componentDidMount() {
    // this.setState({invalidAddress: false})
    const dataKeyTokenAllowance = this.contracts.SingularityNetToken.methods["allowance"].cacheCall(this.props.accounts[0], this.state.spenderAddress);
    this.setState({dataKeyTokenAllowance})
    this.setTokenAllowance(this.props.SingularityNetToken)

    const dataKeyTokenBalance = this.contracts.SingularityNetToken.methods.balanceOf.cacheCall(this.props.accounts[0]);
    this.setState({dataKeyTokenBalance})
    this.setTokenBalance(this.props.SingularityNetToken)

    const dataKeyEscrowBalance = this.contracts.ServiceRequest.methods.balances.cacheCall(this.props.accounts[0]);
    this.setState({dataKeyEscrowBalance})
    this.setEscrowBalance(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.SingularityNetToken !== prevProps.SingularityNetToken || this.state.dataKeyTokenAllowance !== prevState.dataKeyTokenAllowance) {
        this.setTokenAllowance(this.props.SingularityNetToken)
    }
    if (this.props.SingularityNetToken !== prevProps.SingularityNetToken || this.state.dataKeyTokenBalance !== prevState.dataKeyTokenBalance) {
      this.setTokenBalance(this.props.SingularityNetToken)
    }
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || this.state.dataKeyEscrowBalance !== prevState.dataKeyEscrowBalance) {
      this.setEscrowBalance(this.props.ServiceRequest)
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

  setTokenBalance(contract) {
    if (contract.balanceOf[this.state.dataKeyTokenBalance] !== undefined && this.state.dataKeyTokenBalance !== null) {
console.log("contract.balanceOf[this.state.dataKeyTokenBalance].value - " + contract.balanceOf[this.state.dataKeyTokenBalance].value);
      this.setState({
        tknBalance: contract.balanceOf[this.state.dataKeyTokenBalance].value
      })
    }
  }

  setEscrowBalance(contract) {
    if (contract.balances[this.state.dataKeyEscrowBalance] !== undefined && this.state.dataKeyEscrowBalance !== null) {
console.log("contract.balances[this.state.dataKeyEscrowBalance].value - " + contract.balances[this.state.dataKeyEscrowBalance].value);
      this.setState({
        escrowBalance: contract.balances[this.state.dataKeyEscrowBalance].value
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

  handleDepositButton() {
    var amountBN = new BN(this.state.depositAmount)
    var balanceBN = new BN(this.state.tknBalance)
    var allowanceBN = new BN(this.state.tknAllowance)

    if(amountBN.gt(0) && amountBN.lte(balanceBN) && amountBN.lte(allowanceBN)) {
      this.contracts.ServiceRequest.methods["deposit"].cacheSend(this.state.depositAmount, {from: this.props.accounts[0]})
    } else if (amountBN.gt(balanceBN)) {
      this.setState({ alertText: 'Oops! You are trying to transfer more than you have.'})
      this.handleDialogOpen()
    } else if (amountBN.gt(allowanceBN)) {
      this.setState({ alertText: 'Oops! You are trying to transfer more than you have approved.'})
      this.handleDialogOpen()
    } else {
      this.setState({ alertText: 'Oops! Something went wrong. Try checking your transaction details.'})
      this.handleDialogOpen()
    }
  }

  setTXParamValue(_value) {
    if (web3.utils.isBN(_value)) {
      this.setState({
        depositAmount: _value.toString()
      })
    } else {
      this.setState({
        depositAmount: ''
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
    // var depositGroomed = this.groomWei(this.state.depositAmount)

    return (
      <div>
        <Paper style={styles} elevation={5}>
          <p><strong>Deposit Token to RFAI Escrow Contract </strong></p>

          <form className="pure-form pure-form-stacked">
            <p>Token Balance: {this.state.tknBalance} AGI</p>
            <p>Balance in Escrow: {this.state.escrowBalance} AGI</p>
            <p>Token Allowance: {this.state.tknAllowance} AGI</p><br/>
            <input name="depositAmount" type="text" placeholder="Tokens to Deposit:" value={this.state.depositAmount} onChange={this.handleAmountInputChange} /><br/><br/><br/>
            <Button type="Button" variant="contained" onClick={this.handleDepositButton}>Deposit</Button>
          </form>
          {/* <p>Tokens to deposit: {depositGroomed} </p> */}
      </Paper>

      <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
        <p>{this.state.alertText}</p>
        <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
      </Dialog>
      </div>
    )
  }
}

DepositToken.contextTypes = {
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
export default drizzleConnect(DepositToken, mapStateToProps)