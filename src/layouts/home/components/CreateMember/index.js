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

const BN = web3.utils.BN

class CreateMember extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.handleMemberInputChange = this.handleMemberInputChange.bind(this)
    this.handleMemberRoleChange = this.handleMemberRoleChange.bind(this);
    this.handleMemberStatusChange = this.handleMemberStatusChange.bind(this);

    this.handleDialogOpen = this.handleDialogOpen.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleCreateButton = this.handleCreateButton.bind(this)

    this.state = {
      dialogOpen: false,
      memberAddress: '',
      memberRole: 0,
      memberStatus: true,
      alertText: ''
    }
  }

  componentDidMount() {
    this.setState({invalidAddress: false})
  }

  handleMemberInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
    //console.log("handleMemberInputChange: " + this.state.memberAddress)
  }

  handleMemberRoleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
    //console.log("handleMemberRoleChange: " + this.state.memberRole)
  }

  handleMemberStatusChange(event) {
    this.setState({ [event.target.name]: event.target.checked })
    //console.log("handleMemberStatusChange: " + this.state.memberStatus)
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false })
  }

  handleCreateButton() {

    if(this.context.drizzle.web3.utils.isAddress(this.state.memberAddress) ) {

      //console.log("memberAddress: " + this.state.memberAddress)
      //console.log("memberRole: " + this.state.memberRole)
      //console.log("memberStatus: " + this.state.memberStatus)


      const stackId = this.contracts.ServiceRequest.methods["addOrUpdateFoundationMembers"].cacheSend(this.state.memberAddress, this.state.memberRole, this.state.memberStatus, {from: this.props.accounts[0]})
      console.log("stackId : " + stackId);
      console.log("Tx Hash0 : " + this.props.transactionStack[stackId]);
      if (this.props.transactionStack[stackId]) {
        const txHash = this.props.trasnactionStack[stackId]
        console.log("Tx Hash : " + txHash);
        console.log("Tx Status : " + this.props.transactions[txHash].status);
      }

      /*
      var state = this.context.drizzle.store.getState();

      if(state.drizzleStatus.initialized) {
        const stackId = this.contracts.ServiceRequest.methods["addOrUpdateFoundationMembers"].cacheSend(this.state.memberAddress, this.state.memberRole, this.state.memberStatus, {from: this.props.accounts[0]})
        console.log("Tx Hash0 : " + state.transactionStack[stackId]);
        if (state.transactionStack[stackId]) {
          const txHash = state.trasnactionStack[stackId]
          console.log("Tx Hash : " + txHash);
          console.log("Tx Status : " + state.transactions[txHash].status);
        }
      }*/

    } else if (!this.context.drizzle.web3.utils.isAddress(this.state.memberAddress)) {
      this.setState({ alertText: `Oops! The member address isn't a correct ethereum address.`})
      this.handleDialogOpen()
    } else {
      this.setState({ alertText: 'Oops! Something went wrong. Try checking your transaction details.'})
      this.handleDialogOpen()
    }

  }

  render() {
 
    return (
      <div>
        <Paper style={styles} elevation={5}>

        <ContractData contract="ServiceRequest" method="foundationMembers" methodArgs={['0x1df62f291b2e969fb0849d99d9ce41e2f137006e']}/>
        <ContractData contract="ServiceRequest" method="foundationMembers" methodArgs={['0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e']}/>

          <p><strong>Add Foundation Member: </strong></p>
          <form className="pure-form pure-form-stacked">
            <input name="memberAddress" type="text" placeholder="Member address:" value={this.state.memberAddress} onChange={this.handleMemberInputChange} />
            <select name="memberRole" onChange={this.handleMemberRoleChange}>
              <option value="1">Admin</option>
              <option value="0">Normal</option>
            </select>
            <input name="memberStatus" type="checkbox" checked={this.state.memberStatus} onChange={this.handleMemberStatusChange}/>
            <label htmlfor="memberStatus">Active</label>
            <Button type="Button" variant="contained" onClick={this.handleCreateButton}>Add</Button>
          </form>

      </Paper>

      <Dialog PaperProps={dialogStyles} open={this.state.dialogOpen} >
        <p>{this.state.alertText}</p>
        <p><Button variant="contained" onClick={this.handleDialogClose} >Close</Button></p>
      </Dialog>
      </div>
    )
  }
}

CreateMember.contextTypes = {
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
export default drizzleConnect(CreateMember, mapStateToProps)