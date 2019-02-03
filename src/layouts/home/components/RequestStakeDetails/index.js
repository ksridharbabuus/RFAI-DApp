import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import web3 from 'web3'

// Request Table Functionality
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

//components
import Paper from '@material-ui/core/Paper'

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

const rootStyles = {
  style: {
    width: '100%',
    marginTop: 3,
    overflowX: 'auto',
  }
}

const tableStyles = {
    minWidth: 450,
}


class RequestStakeDetails extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts
    this.context = context

    this.state = {
      requestId: this.props.requestId,
      dataKeyRequestId: null,
      dataKeyStakeMembers: [],
      dataKeySubmitters: [],
      requester: '',
      totalFund: 0,
      documentURI: '',
      expiration: 0,
      endSubmission: 0,
      endEvaluation: 0,
      status: 0,
      stakeMembers: [], 
      submitters: [],
      blockNumber: 0,
      dialogOpen: false,
      alertText: ''
    }

    // bool found, uint256 requestId, address requester, uint256 totalFund, bytes documentURI, uint256 expiration, uint256 endSubmission, uint256 endEvaluation, RequestStatus status, address[] stakeMembers, address[] submitters
  }

  componentDidMount() {
    // Get the Data Key
    const dataKeyRequestId = this.contracts.ServiceRequest.methods.getServiceRequestById.cacheCall(this.state.requestId);

    this.setState({dataKeyRequestId})
    this.setRequestDetails(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || prevState.dataKeyRequestId !== this.state.dataKeyRequestId) {
      this.setRequestDetails(this.props.ServiceRequest)
    }
  }

  setRequestDetails(contract) {
    if (contract.getServiceRequestById[this.state.dataKeyRequestId] !== undefined && this.state.dataKeyRequestId !== null) {

      var r = contract.getServiceRequestById[this.state.dataKeyRequestId].value;

      // bool found, uint256 requestId, address requester, uint256 totalFund, bytes documentURI, uint256 expiration, uint256 endSubmission, uint256 endEvaluation, RequestStatus status, address[] stakeMembers, address[] submitters

      this.setState({
        requester: r.requester,
        totalFund: r.totalFund,
        documentURI: r.documentURI,
        expiration: r.expiration,
        endSubmission: r.endSubmission,
        endEvaluation: r.endEvaluation,
        status: r.status,
        stakeMembers: r.stakeMembers, 
        submitters: r.submitters
      }, () => {
        console.log("Request State Loaded for Stake Members");
      });

      // Get all the Stake Members & their contributions
      var dataKeyStakeMembers = []
      for(var i=0; i<r.stakeMembers.length; i++) {
        dataKeyStakeMembers.push(this.contracts.ServiceRequest.methods.getStakeById.cacheCall(this.state.requestId, r.stakeMembers[i]))
      }
      this.setState({dataKeyStakeMembers});
    }
  }

  createRow(staker, index) {

    if (this.props.ServiceRequest.getStakeById[staker] !== undefined && staker !== null) {

      var s = this.props.ServiceRequest.getStakeById[staker].value;
      // bool found, uint256 stake
      if(s.found === true)
      {
        return (
          <React.Fragment>
            <TableRow key={index}> 
                <TableCell component="th" scope="row">{this.state.stakeMembers[index]}</TableCell>
                <TableCell align="right">{s.stake}</TableCell>
              </TableRow>
          </React.Fragment>
        );
      }
    }
  }

  render() {
 
    return (
      <div>
        <Paper styles={rootStyles}>
          <Table style={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Staker</TableCell>
                <TableCell align="right">Amount (AGI)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.dataKeyStakeMembers.map((staker, index) =>  this.createRow(staker, index))}
            </TableBody>
          </Table>
        </Paper>

      </div>
    )
  }
}

RequestStakeDetails.contextTypes = {
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
export default drizzleConnect(RequestStakeDetails, mapStateToProps)