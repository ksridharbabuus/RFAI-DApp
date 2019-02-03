import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

//components
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

//inline styles
const dialogStyles = {
  style: {
    backgroundColor: '#F9DBDB',
    padding: 20
  }
}

class ApproveRequest extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts
    this.context = context

    this.handleRequestInputChange = this.handleRequestInputChange.bind(this)

    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleApproveButton = this.handleApproveButton.bind(this)

console.log("ApproveRequest Constructor " + this.props.requestId + " &&& " + this.props.requestExpiry);

    this.state = {
      requestId: this.props.requestId,
      endSubmission: 0,
      endEvaluation: 0,
      newExpiration: this.props.requestExpiry,
      expiration: this.props.requestExpiry,
      blockNumber: 0,
      dialogOpen: false,
      alertText: ''
    }

    //uint256 requestId, uint256 endSubmission, uint256 endEvaluation, uint256 newExpiration

    this.setBlockNumber();

  }

  componentDidMount() {
    this.setState({invalidAddress: false})
    // Get the Data Key
    // const dataKeyTokenBalance = this.contracts.ServiceRequest.methods.balances.cacheCall(this.props.accounts[0]);

    // this.setState({dataKeyTokenBalance})
    // this.setTokenBalance(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.ServiceRequest !== prevProps.ServiceRequest || prevState.dataKeyTokenBalance !== this.state.dataKeyTokenBalance) {
    //   this.setState({ defaultState: false })
    //     this.setTokenBalance(this.props.ServiceRequest)
    // }
  }

  setBlockNumber() {
    // Update the Block Number
    this.context.drizzle.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber});
    });
  }

  setTokenBalance(contract) {
    // if (contract.balances[this.state.dataKeyTokenBalance] !== undefined && this.state.dataKeyTokenBalance !== null) {
    //   this.setState({
    //     tokenBalance: contract.balances[this.state.dataKeyTokenBalance].value
    //   })
    // }
  }
  
  handleRequestInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false })
  }

  handleApproveButton() {

    // Do client side validations before calling approve request    
    if(parseInt(this.state.endSubmission) > 0 && parseInt(this.state.endSubmission) > parseInt(this.state.blockNumber) && 
      parseInt(this.state.endEvaluation) > 0  && parseInt(this.state.endEvaluation) > parseInt(this.state.blockNumber) && 
      parseInt(this.state.newExpiration) > 0 && parseInt(this.state.newExpiration) > parseInt(this.state.blockNumber) && 
      parseInt(this.state.endEvaluation) > parseInt(this.state.endSubmission) && 
      parseInt(this.state.newExpiration) > parseInt(this.state.endEvaluation))
    {
      // Call Approve Method to approve the request
      const stackId = this.contracts.ServiceRequest.methods["approveRequest"].cacheSend(this.state.requestId, this.state.endSubmission, this.state.endEvaluation, this.state.newExpiration, {from: this.props.accounts[0]})
      if (this.props.transactionStack[stackId]) {
        const txHash = this.props.trasnactionStack[stackId]
        console.log("txHash - " + txHash);
      }
    } else if(this.state.endSubmission === 0 || parseInt(this.state.endEvaluation) <= parseInt(this.state.endSubmission) || parseInt(this.state.endSubmission) <= parseInt(this.state.blockNumber)) {
      this.setState({ alertText: `Oops! Invalid End of Submission block number.`})
      this.handleDialogOpen()
    } else if(this.state.endEvaluation === 0 || parseInt(this.state.newExpiration) <= parseInt(this.state.endEvaluation) || parseInt(this.state.endEvaluation) <= parseInt(this.state.blockNumber)) {
      this.setState({ alertText: `Oops! Invalid End of Evaluation block number.`})
      this.handleDialogOpen()
    } else if(this.state.newExpiration === 0 || parseInt(this.state.newExpiration) <= parseInt(this.state.blockNumber)) {
      this.setState({ alertText: `Oops! Invalid Expiration block number.`})
      this.handleDialogOpen()
    } else {
      this.setState({ alertText: 'Oops! Something went wrong. Try checking your transaction details.'})
      this.handleDialogOpen()
    }

  }

  render() {
 
    return (
      <div>
        {/* <Paper style={styles} elevation={5}> */}
          <form className="pure-form pure-form-stacked">
            <input name="endSubmission" type="text" placeholder="End of Submission:" value={this.state.endSubmission} onChange={this.handleRequestInputChange} /> <br/><br/>
            <input name="endEvaluation" type="text" placeholder="End of Evaluation:" value={this.state.endEvaluation} onChange={this.handleRequestInputChange} /> <br /><br/>
            <input name="newExpiration" type="text" placeholder="Expiration block number:" value={this.state.newExpiration} onChange={this.handleRequestInputChange} /> <br />
            <label>Current Blocknumber: {this.state.blockNumber}</label> <br/>
            <button type="button" class="blue" onClick={this.handleApproveButton}>Submit</button>
            {/* <Button type="Button" variant="contained" onClick={this.handleApproveButton}>Create</Button> */}
          </form>
        {/* </Paper> */}

      <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
        <p>{this.state.alertText}</p>
        <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
      </Dialog>
      </div>
    )
  }
}

ApproveRequest.contextTypes = {
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
export default drizzleConnect(ApproveRequest, mapStateToProps)