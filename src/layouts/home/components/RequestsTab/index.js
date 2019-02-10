import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

// Request Tabs Functionality
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

// Custom Components
import RequestListV2 from '../../components/RequestListV2'

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

class RequestsTab extends Component {

  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts;

    this.state = {
      dataKeyMemberKeys: null,
      foundationMembers: [],
      dataKeyOwner: null,
      owner: null,
      selectedTab: 1,
      dialogOpen: false,
      isFoundationMember: false,
      alertText: ''
    }

  }

  componentDidMount() {
    const dataKeyMemberKeys = this.contracts.ServiceRequest.methods.getFoundationMemberKeys.cacheCall();
    this.setState({dataKeyMemberKeys})
    this.setFoundationMembers(this.props.ServiceRequest)

    const dataKeyOwner  = this.contracts.ServiceRequest.methods.owner.cacheCall();
    this.setState({dataKeyOwner})
    this.setOwner(this.props.ServiceRequest)

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || this.state.dataKeyMemberKeys !== prevState.dataKeyMemberKeys) {
        this.setFoundationMembers(this.props.ServiceRequest)
    }
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || this.state.dataKeyOwner !== prevState.dataKeyOwner) {
      this.setOwner(this.props.ServiceRequest)
    }
  }

  setFoundationMembers(contract) {

    if (contract.getFoundationMemberKeys[this.state.dataKeyMemberKeys] !== undefined && this.state.dataKeyMemberKeys !== null) {
      this.setState({
        foundationMembers: contract.getFoundationMemberKeys[this.state.dataKeyMemberKeys].value
      }, () => {
        const exists = this.state.foundationMembers.some(m => m === this.props.accounts[0])
        if(exists) {
          this.setState({isFoundationMember : exists});
          //if(this.state.selectedTab !== 0) this.setState ({selectedTab : 0})  
        }
          
      });
    }

  }

  setOwner(contract) {
    if (contract.owner[this.state.dataKeyOwner] !== undefined && this.state.dataKeyOwner !== null) {
      this.setState({
        owner: contract.owner[this.state.dataKeyOwner].value
      }, () => {
        if( this.state.owner === this.props.accounts[0]) {
          this.setState({isFoundationMember : true});
          //if(this.state.selectedTab !== 0) this.setState ({selectedTab : 0})
        }          
      });
    }
  }

  handleChange = (event, value) => {
    this.setState({ selectedTab: value });
console.log("selectedTab - " + value);
  };

  render() {

    const selectedTab = this.state.selectedTab;
    return (
      <div className="main-content">
      <div className="main">
        <AppBar position="static" color="default">
          <Tabs value={selectedTab} onChange={this.handleChange}>
            {this.state.isFoundationMember === true && <Tab label="Open " value={0}/> }
            <Tab label="Approved " value={1}/>
            <Tab label="Rejected " value={2} />
            <Tab label="Closed " value={3} />
            <Tab label="Expired " value={4} />
          </Tabs>
        </AppBar>
        {selectedTab === 0 && this.state.isFoundationMember === true && <Typography component="div" ><RequestListV2  compRequestStatus="0"/> </Typography>}        
        {selectedTab === 1 && <Typography component="div" ><RequestListV2  compRequestStatus="1"/> </Typography>}
        {selectedTab === 2 && <Typography component="div" ><RequestListV2  compRequestStatus="2"/> </Typography>}
        {selectedTab === 3 && <Typography component="div" ><RequestListV2  compRequestStatus="4"/> </Typography>}
        {selectedTab === 4 && <Typography component="div" ><RequestListV2  compRequestStatus="999"/> </Typography>}
      </div>
      </div>
    )
  }
}

RequestsTab.contextTypes = {
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

export default drizzleConnect(RequestsTab, mapStateToProps)
