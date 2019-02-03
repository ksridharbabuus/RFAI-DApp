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
import Dialog from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'

// Custom Components
import ApproveToken from '../../components/ApproveToken'
import DepositToken from '../../components/DepositToken'
import WithdrawToken from '../../components/WithdrawToken'

//inline styles
const rootStyles = {
    flexGrow: 1,
    backgroundColor: "#aabbcc",
}

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

class MyAccount extends Component {

  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts;

    this.state = {
      selectedTab: 0,
      dialogOpen: false,
      alertText: ''
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  handleChange = (event, value) => {
    this.setState({ selectedTab: value });
  };

  render() {

    const selectedTab = this.state.selectedTab;
    
    return (
      <div class="main-content">
      <div > {/*  class="main" Looks like this style has fixed width for the Tab Control...*/}
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={this.handleChange}>
            <Tab label="Allowance" />
            <Tab label="Deposit" />
            <Tab label="Withdraw" />
            <Tab label="Admin" />
          </Tabs>
        </AppBar>
        {selectedTab === 0 && <Typography component="div" ><ApproveToken /> </Typography>}
        {selectedTab === 1 && <Typography component="div" ><DepositToken /> </Typography>}
        {selectedTab === 2 && <Typography component="div" ><WithdrawToken /> </Typography>}
      </div>

      </div>
    )
  }
}

MyAccount.contextTypes = {
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

export default drizzleConnect(MyAccount, mapStateToProps)