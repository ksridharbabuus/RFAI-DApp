import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import web3 from 'web3'
import { ContractData } from 'drizzle-react-components'

// Request Table Functionality
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

//components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
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

const rootStyles = {
  style: {
    width: '100%',
    marginTop: 3,
    overflowX: 'auto',
  }
}

const tableStyles = {
  style: {
    minWidth: 700,
  }
}


class RequestSolution extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts
    this.context = context

    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleVoteButton = this.handleVoteButton.bind(this)

console.log("RequestSolution Constructor " + this.props.requestId);

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
    this.setBlockNumber();

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

  setBlockNumber() {
    // Update the Block Number
    this.context.drizzle.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber});
    });
  }

  setRequestDetails(contract) {
    if (contract.getServiceRequestById[this.state.dataKeyRequestId] !== undefined && this.state.dataKeyRequestId !== null) {

      var r = contract.getServiceRequestById[this.state.dataKeyRequestId].value;

      // bool found, uint256 requestId, address requester, uint256 totalFund, bytes documentURI, uint256 expiration, uint256 endSubmission, uint256 endEvaluation, RequestStatus status, address[] stakeMembers, address[] submitters

      this.setState({
        //tokenBalance: contract.balances[this.state.dataKeyTokenBalance].value
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
        console.log("Request State Loaded ");
      });

      // Get all the Submitted Solutions
      var dataKeySubmitters = []
      for(var i=0; i<r.submitters.length; i++) {
        dataKeySubmitters.push(this.contracts.ServiceRequest.methods.getSubmittedSolutionById.cacheCall(this.state.requestId, r.submitters[i]))
      }
      this.setState({dataKeySubmitters});

      var dataKeyStakeMembers = []
      for(var i=0; i<r.stakeMembers.length; i++) {
        dataKeyStakeMembers.push(this.contracts.ServiceRequest.methods.getStakeById.cacheCall(this.state.requestId, r.stakeMembers[i]))
      }
      this.setState({dataKeyStakeMembers});

    }
  }
  
  handleDialogOpen() {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false })
  }

  handleVoteButton(event, votedFor) {

    const stackId = this.contracts.ServiceRequest.methods["vote"].cacheSend(this.state.requestId, votedFor, {from: this.props.accounts[0]})
    if (this.props.transactionStack[stackId]) {
      const txHash = this.props.trasnactionStack[stackId]
    }

  }

  createRow(submitter, index) {

    if (this.props.ServiceRequest.getSubmittedSolutionById[submitter] !== undefined && submitter !== null) {

      var s = this.props.ServiceRequest.getSubmittedSolutionById[submitter].value;
      // bool found, bytes solutionDocURI, uint256 totalVotes, bool isSubmitted, bool isShortlisted, bool isClaimed
      if(s.found === true)
      {
        return (
          <React.Fragment>
            <TableRow key={index}> 
                <TableCell component="th" scope="row">{this.state.submitters[index]}</TableCell>
                <TableCell align="right">{s.solutionDocURI}</TableCell>
                <TableCell align="right">
                  {s.totalVotes} - {s.isSubmitted} - {s.isShortlisted} - {s.isClaimed} <br/>
                  <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={event => this.handleVoteButton(event, this.state.submitters[index])}>Vote</button>
                </TableCell>
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
          <Table styles={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Submitter</TableCell>
                <TableCell align="right">Solution URI</TableCell>
                <TableCell align="right">Vote</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.dataKeySubmitters.map((submitter, index) =>  this.createRow(submitter, index))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
          <p>{this.state.alertText}</p>
          <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
        </Dialog>
      </div>
    )
  }
}

RequestSolution.contextTypes = {
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
export default drizzleConnect(RequestSolution, mapStateToProps)