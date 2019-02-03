import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import web3 from 'web3'
import PropTypes from 'prop-types'

// Request Tabs Functionality
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'

// Custom Components
// import RequestListV2 from '../../components/RequestListV2'
import ApproveToken from '../../components/ApproveToken'
import DepositToken from '../../components/DepositToken'

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

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class StakeRequest extends Component {

  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts;

    this.handleAmountInputChange = this.handleAmountInputChange.bind(this)
    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleStakeButton = this.handleStakeButton.bind(this)
    this.setTXParamValue = this.setTXParamValue.bind(this)

    this.state = {
      requestId: this.props.requestId,
      dataKeyEscrowBalance: null,
      escrowBalance: 0,
      stakeAmount: 0,
      selectedTab: 0,
      dialogOpen: false,
      alertText: ''
    }

  }

  componentDidMount() {
    const dataKeyEscrowBalance = this.contracts.ServiceRequest.methods.balances.cacheCall(this.props.accounts[0]);
    this.setState({dataKeyEscrowBalance})
    this.setEscrowBalance(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || this.state.dataKeyEscrowBalance !== prevState.dataKeyEscrowBalance) {
      this.setEscrowBalance(this.props.ServiceRequest)
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

  handleChange = (event, value) => {
    this.setState({ selectedTab: value });
  console.log("Stake Request selectedTab - " + value);
  };

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

  handleStakeButton() {
    var amountBN = new BN(this.state.stakeAmount)
    var escrowBalanceBN = new BN(this.state.escrowBalance)

    if(amountBN.gt(0) && amountBN.lte(escrowBalanceBN)) {
      this.contracts.ServiceRequest.methods["addFundsToRequest"].cacheSend(this.state.requestId, this.state.stakeAmount, {from: this.props.accounts[0]})
    } else if (amountBN.gt(escrowBalanceBN)) {
      this.setState({ alertText: 'Oops! You are trying to transfer more than you have in Escrow.'})
      this.handleDialogOpen()
    } else {
      this.setState({ alertText: 'Oops! Something went wrong. Try checking your transaction details.'})
      this.handleDialogOpen()
    }
  }

  setTXParamValue(_value) {
    if (web3.utils.isBN(_value)) {
      this.setState({
        stakeAmount: _value.toString()
      })
    } else {
      this.setState({
        stakeAmount: ''
      })
    }
  }

  stakeFragment() {
    return (
      <Paper style={styles} elevation={5}>
          <p><strong>Stake Token for Request Id - {this.state.requestId} </strong></p>

          <form className="pure-form pure-form-stacked">
            <p>Balance in Escrow: {this.state.escrowBalance} AGI</p>
            <input name="stakeAmount" type="text" placeholder="Tokens to Stake:" value={this.state.stakeAmount} onChange={this.handleAmountInputChange} /><br/><br/><br/>
            <Button type="Button" variant="contained" onClick={this.handleStakeButton}>Stake</Button>
          </form>
      </Paper>
    )
  }

  render() {

    const selectedTab = this.state.selectedTab;
    
    return (
      <div class="main-content">
      <div > {/*  class="main" Looks like this style has fixed width for the Tab Control...*/}
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={this.handleChange}>
            <Tab label="Allowance " />
            <Tab label="Deposit " />
            <Tab label="Stake " />
          </Tabs>
        </AppBar>
        {selectedTab === 0 && <Typography component="div" ><ApproveToken /> </Typography>}
        {selectedTab === 1 && <Typography component="div" ><DepositToken /> </Typography>}
        {selectedTab === 2 && <Typography component="div" > {this.stakeFragment()} </Typography>}
      </div>

      <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
        <p>{this.state.alertText}</p>
        <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
      </Dialog>


      </div>
    )
  }
}

StakeRequest.contextTypes = {
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

export default drizzleConnect(StakeRequest, mapStateToProps)
