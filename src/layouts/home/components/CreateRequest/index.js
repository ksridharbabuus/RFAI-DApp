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

class CreateRequest extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts
    this.context = context

    this.handleRequestInputChange = this.handleRequestInputChange.bind(this)

    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleCreateButton = this.handleCreateButton.bind(this)

    this.state = {
      dialogOpen: false,
      value: 0,
      expiration: 0,
      documentURI: '',
      dataKeyTokenBalance: null,
      tknBalance: 0,
      blockNumber: 0,
      alertText: ''
    }

    this.setBlockNumber();

  }

  componentDidMount() {
    this.setState({invalidAddress: false})
    // Get the Data Key
    const dataKeyTokenBalance = this.contracts.ServiceRequest.methods.balances.cacheCall(this.props.accounts[0]);

    this.setState({dataKeyTokenBalance})
    this.setTokenBalance(this.props.ServiceRequest)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ServiceRequest !== prevProps.ServiceRequest || prevState.dataKeyTokenBalance !== this.state.dataKeyTokenBalance) {
      this.setState({ defaultState: false })
        this.setTokenBalance(this.props.ServiceRequest)
    }
  }

  setBlockNumber() {
    // Update the Block Number
    this.context.drizzle.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber});
    });
  }

  setTokenBalance(contract) {
    if (contract.balances[this.state.dataKeyTokenBalance] !== undefined && this.state.dataKeyTokenBalance !== null) {
      this.setState({
        tokenBalance: contract.balances[this.state.dataKeyTokenBalance].value
      })
    }
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

  handleCreateButton() {


    //value, expiration, documentURI 
    // Add Condifition of the BlockNumber Validation as well
    if(this.state.documentURI.length > 0 && this.state.value > 0 && this.state.value <= this.state.tokenBalance) {
      const stackId = this.contracts.ServiceRequest.methods["createRequest"].cacheSend(this.state.value, this.state.expiration, this.state.documentURI, {from: this.props.accounts[0]})

      if (this.props.transactionStack[stackId]) {
        const txHash = this.props.trasnactionStack[stackId]
      }
    } else if (this.state.value === 0 || this.state.value >= this.state.tokenBalance) {
      this.setState({ alertText: `Oops! You dont have enough token balance.`})
      this.handleDialogOpen()
    } else if (this.state.expiration === 0) {
      this.setState({ alertText: `Oops! Expiration should be great than current blocknumber.`})
      this.handleDialogOpen()  
    }else if (this.state.documentURI.length === 0) {
      this.setState({ alertText: `Oops! It is invalid document URI.`})
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
            <input name="value" type="text" placeholder="tokens to stake:" value={this.state.value} onChange={this.handleRequestInputChange} /> <br/><br/>
            <input name="expiration" type="text" placeholder="expiration block number:" value={this.state.expiration} onChange={this.handleRequestInputChange} /> <br />
            <label>Current Blocknumber: {this.state.blockNumber}</label> <br/>
            <input name="documentURI" type="text" placeholder="documentURI:" value={this.state.documentURI} onChange={this.handleRequestInputChange} /><br/><br/>
            <button type="button" class="blue" onClick={this.handleCreateButton}>Submit</button>
            {/* <Button type="Button" variant="contained" onClick={this.handleCreateButton}>Create</Button> */}
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

CreateRequest.contextTypes = {
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
export default drizzleConnect(CreateRequest, mapStateToProps)