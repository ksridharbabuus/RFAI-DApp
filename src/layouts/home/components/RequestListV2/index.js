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

    this.handleAcceptButton = this.handleAcceptButton.bind(this)
    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleOpenRequestDialogClose = this.handleOpenRequestDialogClose.bind(this)

    // this.handleCreateButton = this.handleCreateButton.bind(this)

    this.state = {
      dataKeyNextRequestId: null,
      nextRequestId: 0,
      dataKeyRequestKeys: [],
      requests: [],
      compRequestStatus: props.compRequestStatus,
      dialogOpen: false,
      dialogOpenRequest: false,
      alertText: ''
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

  handleAcceptButton() {
    this.setState({ dialogOpenRequest: true })
  }

  handleOpenRequestDialogClose() {
    this.setState({ dialogOpenRequest: false })
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
                        <button class="blue float-right ml-4" data-toggle="modal" data-target="#exampleModal" onClick={this.handleAcceptButton}>Accept Request</button>
                        <button class="red float-right ml-4">Reject Request</button>                                   
                    </div>
                </div>
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

                <TableCell align="right">{r.totalFund}</TableCell>
                <TableCell align="right"><ExpandMoreIcon /></TableCell>

              </TableRow>
              {this.createDetailedRow(req, index)}
          </React.Fragment>
        );
      }
    }
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
              {this.state.dataKeyRequestKeys.map((req, index) =>  this.createRow(req, index))}
            </TableBody>
          </Table>
        </Paper>



        <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
          <p>{this.state.alertText}</p>
          <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
        </Dialog>

        <Dialog PaperProps={dialogStyles} open={this.state.dialogOpenRequest} >
          <p>My Accept Request Content Goes here...</p>
          <p><Button variant="contained" onClick={this.handleOpenRequestDialogClose} >Close</Button></p>
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
