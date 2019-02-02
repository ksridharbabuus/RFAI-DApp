import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

//components
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'


// Request Table Functionality
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// Exapandable pannels
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ApproveRequest from '../../components/ApproveRequest'
import StakeRequest from '../../components/StakeRequest'

import RequestSolution from '../../components/RequestSolution'

import RequestStakeDetails from '../../components/RequestStakeDetails'


// const styles = theme => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing.unit * 3,
//     overflowX: 'auto',
//   },
//   table: {
//     minWidth: 700,
//   },
// });

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

const dialogApproveStyles = {
  style: {
    backgroundColor: 'white',
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

class RequestListV2 extends Component {

  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    // this.handleMemberInputChange = this.handleMemberInputChange.bind(this)
    // this.handleMemberRoleChange = this.handleMemberRoleChange.bind(this);
    // this.handleMemberStatusChange = this.handleMemberStatusChange.bind(this);

    this.handleApproveButton = this.handleApproveButton.bind(this)

    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)

    this.handleApproveRequestDialogClose = this.handleApproveRequestDialogClose.bind(this)


    this.handleStakeButton = this.handleStakeButton.bind(this)
    this.handleStakeRequestDialogClose = this.handleStakeRequestDialogClose.bind(this)

    this.handleSubmitSolutionButton = this.handleSubmitSolutionButton.bind(this)
    this.handleSubmitSolutionDialogClose = this.handleSubmitSolutionDialogClose.bind(this)

    this.handleSubmitSolution2Button = this.handleSubmitSolution2Button.bind(this)
    this.handleRequestInputChange = this.handleRequestInputChange.bind(this)

    this.handleShowStakeButton = this.handleShowStakeButton.bind(this);
    this.handleShowStakeDialogClose = this.handleShowStakeDialogClose.bind(this)


    this.state = {
      dataKeyNextRequestId: null,
      nextRequestId: 0,
      dataKeyRequestKeys: [],
      requests: [],
      compRequestStatus: props.compRequestStatus,
      dialogOpen: false,
      dialogOpenApproveRequest: false,
      dialogOpenStakeRequest: false,
      dialogOpenSubmitSolutionRequest: false,
      dialogOpenShowStake: false,

      alertText: '',

      solutionDocumentURI: '',
      approveRequestId: 0,
      approveRequestExpiry: 0,
      selectedRequestId: 0,
      selectedRequestExpiry: 0
    }

  }

  componentDidMount() {
    const dataKeyNextRequestId = this.contracts.ServiceRequest.methods.nextRequestId.cacheCall();
    this.setState({dataKeyNextRequestId})
    this.setRequests(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || this.state.dataKeyNextRequestId !== prevState.dataKeyNextRequestId || this.state.nextRequestId !== prevState.nextRequestId) {
      this.setState({ defaultState: false })
      this.setRequests(this.props.ServiceRequest)
    }
  }

  setRequests(contract) {

    if (contract.nextRequestId[this.state.dataKeyNextRequestId] !== undefined && this.state.dataKeyNextRequestId !== null) {
      const nextRequestId = contract.nextRequestId[this.state.dataKeyNextRequestId].value
      this.setState({nextRequestId})

      var dataKeyRequestKeys = []
      for(var i=0; i< this.state.nextRequestId; i++) {
        dataKeyRequestKeys.push(this.contracts.ServiceRequest.methods.requests.cacheCall(i))
      }
      this.setState({dataKeyRequestKeys});

    }
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false })
  }

  handleApproveButton(event, requestId, expiry) {

    console.log("handleApproveButton requestId - " + requestId);
    console.log("handleApproveButton expiry - " + expiry);
    // , approveRequestId: requestId, approveRequestExpiry: expiry
    this.setState({approveRequestId: requestId, approveRequestExpiry: expiry}, () => {

      this.setState( {dialogOpenApproveRequest: true});
      console.log("handleApproveButton requestId in state - " + this.state.approveRequestId);
      console.log("handleApproveButton expiry in state - " + this.state.approveRequestExpiry);
    })
  }

  handleStakeButton(event, requestId, expiry) {

    console.log("handleStakeButton selected requestId - " + requestId);
    console.log("handleStakeButton selected expiry - " + expiry);

    this.setState({selectedRequestId: requestId, selectedRequestExpiry: expiry}, () => {

      this.setState( {dialogOpenStakeRequest: true});
      console.log("handleStakeButton selected requestId in state - " + this.state.selectedRequestId);
      console.log("handleStakeButton selected expiry in state - " + this.state.selectedRequestExpiry);
    })
  }

  
  handleSubmitSolutionButton(event, requestId, expiry) {

    console.log("handleSubmitSolutionButton selected requestId - " + requestId);
    console.log("handleSubmitSolutionButton selected expiry - " + expiry);

    this.setState({selectedRequestId: requestId, selectedRequestExpiry: expiry}, () => {

      this.setState( {dialogOpenSubmitSolutionRequest: true});
      console.log("handleSubmitSolutionButton selected requestId in state - " + this.state.selectedRequestId);
      console.log("handleSubmitSolutionButton selected expiry in state - " + this.state.selectedRequestExpiry);
    })
  }


  handleRejectButton(event, requestId) {
    const stackId = this.contracts.ServiceRequest.methods["rejectRequest"].cacheSend(requestId, {from: this.props.accounts[0]})
      if (this.props.transactionStack[stackId]) {
        const txHash = this.props.trasnactionStack[stackId]
      }
  }

  handleSubmitSolution2Button() {
    
    if(this.state.solutionDocumentURI.length > 0) {
console.log("this.state.selectedRequestId - " + this.state.selectedRequestId)      
      const stackId = this.contracts.ServiceRequest.methods["createOrUpdateSolutionProposal"].cacheSend(this.state.selectedRequestId, this.state.solutionDocumentURI, {from: this.props.accounts[0]})
      if (this.props.transactionStack[stackId]) {
        const txHash = this.props.trasnactionStack[stackId]
      }
    } else if (this.state.solutionDocumentURI.length === 0) {
      this.setState({ alertText: 'Oops! Invalid solution document URI.'})
      this.handleDialogOpen()
    } else {
      this.setState({ alertText: 'Oops! Something went wrong. Try checking your transaction details.'})
      this.handleDialogOpen()
    }

    
  }

  handleShowStakeButton(event, requestId) {
    this.setState({selectedRequestId: requestId}, () => {
      this.setState( {dialogOpenShowStake: true});
    })
  }

  handleApproveRequestDialogClose() {
    this.setState({ dialogOpenApproveRequest: false })
  }

  handleStakeRequestDialogClose() {
    this.setState({ dialogOpenStakeRequest: false })
  }

  handleSubmitSolutionDialogClose() {
    this.setState({ dialogOpenSubmitSolutionRequest: false })
  }

  handleRequestInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleShowStakeDialogClose() {
    this.setState( {dialogOpenShowStake: false});
  }

  createDetailedRow(req, index) {

    if (this.props.ServiceRequest.requests[req] !== undefined && req !== null) {

      var r = this.props.ServiceRequest.requests[req].value;

      // If Rquest is Open
      if(r.status === "0") {
        return (
            <TableRow key={r.requestId + r.requester}>
              <TableCell colSpan={4}>
                <div class="row">
                    <div class="col-8">
                        <div>Requester: <span>{r.requester}</span></div>
                        <div>documentURI: <span>{r.documentURI}</span></div>
                        <div>Expiry: <span>{r.expiration}</span></div>
                    </div>                                        
                </div>
                <div class="row">
                    <div class="col">
                        <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={event => this.handleApproveButton(event, r.requestId, r.expiration)}>Approve Request</button>
                        <button class="red float-right ml-4" onClick={event => this.handleRejectButton(event, r.requestId)}>Reject Request</button>                                   
                    </div>
                </div>
              </TableCell>
            </TableRow>
        )
      } else if(r.status === "1") {
        return (
          <TableRow key={r.requestId + r.requester}>
            <TableCell colSpan={4}>
              <div class="row">
                  <div class="col-8">
                      <div>Requester: <span>{r.requester}</span></div>
                      <div>documentURI: <span>{r.documentURI}</span></div>
                      <div>Expiry: <span>{r.expiration}</span></div>
                  </div>                                        
              </div>
              <div class="row">
                  <div class="col-8">
                      <div>Submitted Solutions<span></span></div>
                      <div>Submitter: <span></span> Document URI: <span></span></div>
                  </div>                                        
              </div>
              <div class="row">
                  <div class="col">
                      <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={event => this.handleSubmitSolutionButton(event, r.requestId, r.expiration)}> Submit Solution</button>
                      <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={event => this.handleStakeButton(event, r.requestId, r.expiration)}>Stake Request</button>
                      {/* <button class="red float-right ml-4" onClick={event => this.handleRejectButton(event, r.requestId)}>Reject Request</button>                                    */}
                  </div>
              </div>

              <div class="row">
                  <div class="col-8">
                       <p>Submitted Solutions:</p>
                      <RequestSolution requestId={r.requestId}/>
                  </div>                                        
              </div>
              

            </TableCell>
          </TableRow>
        )
      }else if(r.status === "2") {
        return (
          <TableRow key={r.requestId + r.requester}>
            <TableCell colSpan={4}>
              <div class="row">
                  <div class="col-8">
                      <div>Requester: <span>{r.requester}</span></div>
                      <div>documentURI: <span>{r.documentURI}</span></div>
                      <div>Expiry: <span>{r.expiration}</span></div>
                  </div>                                        
              </div>
              {/* <div class="row">
                  <div class="col">
                      <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={event => this.handleStakeButton(event, r.requestId, r.expiration)}>Stake Request</button>
                      <button class="red float-right ml-4" onClick={event => this.handleRejectButton(event, r.requestId)}>Reject Request</button>                                   
                  </div>
              </div> */}
            </TableCell>
          </TableRow>
        )
      }

    }

  }

  createRow(req, index) {

    // <TableCell align="right">{r.documentURI}</TableCell>
    // <TableCell align="right">{r.expiration}</TableCell>

    if (this.props.ServiceRequest.requests[req] !== undefined && req !== null) {

      var r = this.props.ServiceRequest.requests[req].value;
      if(r.status === this.state.compRequestStatus)
      {
        return (
          <React.Fragment>
            <TableRow key={r.requestId}>
                <TableCell component="th" scope="row">{r.requestId}</TableCell>
                <TableCell align="right">{r.requester}</TableCell>

                <TableCell align="right">
                  <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={event => this.handleShowStakeButton(event, r.requestId)}>{r.totalFund}</button>
                </TableCell>
                <TableCell align="right"><ExpandMoreIcon /></TableCell>

              </TableRow>
              {this.createDetailedRow(req, index)}
          </React.Fragment>
        );
      }
    }
  }

  generateRequests() {

    const requestsHTML = this.state.dataKeyRequestKeys.map((req, index) =>  { 
      return this.createRow(req, index)
    })
    
    const noRequests = <TableRow><TableCell colSpan={4}>No requests found </TableCell> </TableRow>
// console.log("requestsHTML.length - " + requestsHTML.length + "---" + this.state.compRequestStatus)
// console.log("requestsHTML -- " + requestsHTML);
    return noRequests;



  }

  render() {

    // <TableCell align="right">Document URI</TableCell>
    // <TableCell align="right">Expiration</TableCell>

    return (
      <div class="main">
        <Paper styles={rootStyles}>
          <Table styles={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Request Id</TableCell>
                <TableCell align="right">Requester</TableCell>

                <TableCell align="right">Total Funds (AGI)</TableCell>
                <TableCell align="right">+/-</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.generateRequests() /* {this.state.dataKeyRequestKeys.map((req, index) =>  this.createRow(req, index))} */}
            </TableBody>
          </Table>
        </Paper>

        <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
          <p>{this.state.alertText}</p>
          <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
        </Dialog>

        {/* <Dialog PaperProps={dialogStyles} open={this.state.dialogOpenApproveRequest} >
          <ApproveRequest requestId={this.state.approveRequestId} requestExpiry={this.state.approveRequestExpiry} />
          <p><Button variant="contained" onClick={this.handleApproveRequestDialogClose} >Close</Button></p>
        </Dialog> */}


        <Dialog PaperProps={dialogApproveStyles} open={this.state.dialogOpenApproveRequest} >

          <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Approve Request</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleApproveRequestDialogClose}>
                              <span aria-hidden="true">&times;</span>
                          </button>
                          <div class="clear"></div><br/>
                      </div>
                      <div class="modal-body">
                      <ApproveRequest requestId={this.state.approveRequestId} requestExpiry={this.state.approveRequestExpiry} />
                      </div>
                      {/* <div class="modal-footer">
                          <button type="button" class="white" data-dismiss="modal">Close</button>
                          <button type="button" class="blue">Submit</button>
                      </div> */}
                  </div>
              </div>
            {/* <p><Button variant="contained" onClick={this.handleCreateRequestDialogClose} >Close</Button></p> */}
        </Dialog>


        <Dialog PaperProps={dialogApproveStyles} open={this.state.dialogOpenStakeRequest} >
          <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Stake Request</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleStakeRequestDialogClose}>
                              <span aria-hidden="true">&times;</span>
                          </button>
                          <div class="clear"></div><br/>
                      </div>
                      <div class="modal-body">
                      <StakeRequest requestId={this.state.selectedRequestId} requestExpiry={this.state.selectedRequestExpiry} />
                      </div>
                      {/* <div class="modal-footer">
                          <button type="button" class="white" data-dismiss="modal">Close</button>
                          <button type="button" class="blue">Submit</button>
                      </div> */}
                  </div>
              </div>
            {/* <p><Button variant="contained" onClick={this.handleCreateRequestDialogClose} >Close</Button></p> */}
          </Dialog>

          <Dialog PaperProps={dialogApproveStyles} open={this.state.dialogOpenSubmitSolutionRequest} >
          <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Submit Solution</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleSubmitSolutionDialogClose}>
                              <span aria-hidden="true">&times;</span>
                          </button>
                          <div class="clear"></div><br/>
                      </div>
                      <div class="modal-body">
                      {/* <StakeRequest requestId={this.state.selectedRequestId} requestExpiry={this.state.selectedRequestExpiry} /> */}


                        <div class="main-content">
                            <div > {/*  class="main" Looks like this style has fixed width for the Tab Control...*/}
                              <Paper style={dialogApproveStyles} elevation={5}>
                                <p><strong>Submit Solution to Request Id - {this.state.selectedRequestId} </strong></p>

                                <form className="pure-form pure-form-stacked">
                                  <input name="solutionDocumentURI" type="text" placeholder="Document URI:" value={this.state.solutionDocumentURI} onChange={this.handleRequestInputChange} /><br/><br/><br/>
                                  <Button type="Button" variant="contained" onClick={this.handleSubmitSolution2Button}>Submit</Button>
                                </form>
                                {/* <p>Tokens to deposit: {depositGroomed} </p> */}
                              </Paper>
                            </div>
                        </div>

                      {/* <div class="modal-footer">
                          <button type="button" class="white" data-dismiss="modal">Close</button>
                          <button type="button" class="blue">Submit</button>
                      </div> */}
                  </div>
              </div>
            </div>
            {/* <p><Button variant="contained" onClick={this.handleCreateRequestDialogClose} >Close</Button></p> */}
          </Dialog>

          <Dialog PaperProps={dialogApproveStyles} open={this.state.dialogOpenShowStake} >
           <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Request Stake Details</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleShowStakeDialogClose}>
                              <span aria-hidden="true">&times;</span>
                          </button>
                          <div class="clear"></div><br/>
                      </div>
                      <div class="modal-body">
                        <RequestStakeDetails requestId={this.state.selectedRequestId} />
                      </div>
                  </div>
            </div>
            {/* <p><Button variant="contained" onClick={this.handleCreateRequestDialogClose} >Close</Button></p> */}
          </Dialog>

      </div>




    )
  }
}

RequestListV2.contextTypes = {
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

export default drizzleConnect(RequestListV2, mapStateToProps)
