import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import web3 from 'web3'
import { ContractData } from 'drizzle-react-components'

//components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
//import InvalidAddressModal from '../InvalidAddressModal'
import Dialog from '@material-ui/core/Dialog'

//inline styles
const styles = {
    backgroundColor: '#F9DBDB',
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

    this.state = {
      dialogOpen: false,
      spenderAddress: this.props.tknSpender,
      depositAmount: '',
      alertText: ''
    }
  }

  componentDidMount() {
    this.setState({invalidAddress: false})
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
    var balanceBN = new BN(this.props.tknBalance)
    var allowanceBN = new BN(this.props.allowanceBalance)

    if(amountBN.lte(balanceBN) && amountBN.lte(allowanceBN)) {
      this.contracts.ServiceRequest.methods["deposit"].cacheSend(this.state.depositAmount, {from: this.props.accounts[0]})
    } else if (amountBN.gt(balanceBN)) {
      this.setState({ alertText: 'Oops! You are trying to transfer more than you have.'})
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

  groomWei(weiValue) {
    var factor = Math.pow(10, 8)
    var balance = this.context.drizzle.web3.utils.fromWei(weiValue)
    balance = Math.round(balance * factor) / factor
    return balance
  }

  render() {
    var depositGroomed = this.groomWei(this.state.depositAmount)

    return (
      <div>
        <Paper style={styles} elevation={5}>
          <p><strong>Deposit Token to RFAI Escrow Contract: </strong></p>

          <form className="pure-form pure-form-stacked">
            <input name="depositAmount" type="text" placeholder="tokens to deposit:" value={this.state.depositAmount} onChange={this.handleAmountInputChange} />
            <Button type="Button" variant="contained" onClick={this.handleDepositButton}>Deposit</Button>
          </form>
          <p>Tokens to deposit: {depositGroomed} </p>
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
    SimpleStorage: state.contracts.SimpleStorage,
    TutorialToken: state.contracts.TutorialToken,
    SingularityNetToken: state.contracts.SingularityNetToken,
    ServiceRequest: state.contracts.ServiceRequest,
    drizzleStatus: state.drizzleStatus,
    transactionStack: state.transactionStack,
    transactions: state.transactions
  }
}
export default drizzleConnect(DepositToken, mapStateToProps)