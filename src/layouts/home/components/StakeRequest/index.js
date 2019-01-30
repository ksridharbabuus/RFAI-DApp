import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

// Request Tabs Functionality
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// Custom Components
// import RequestListV2 from '../../components/RequestListV2'
import ApproveToken from '../../components/ApproveToken'
import DepositToken from '../../components/DepositToken'

//inline styles
const rootStyles = {
    flexGrow: 1,
    backgroundColor: "#aabbcc",
}

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

    this.state = {
      requestId: this.props.requestId,
      selectedTab: 0,
      dialogOpen: false,
      alertText: ''
    }


  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }


  handleChange = (event, value) => {
    this.setState({ selectedTab: value });
  console.log("Stake Request selectedTab - " + value);
  };

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
        {selectedTab === 2 && <Typography component="div" >Stake </Typography>}
      </div>
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
