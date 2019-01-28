import React, { Component } from 'react'
import logo from '../../../../images/Logo.png'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

// import components
import CreateRequest from '../../components/CreateRequest'

const dialogStyles = {
    style: {
      backgroundColor: 'white',
      padding: 5
    }
  }

class LandingPage extends Component {

    constructor(props, context) {
        super(props)
    
        this.contracts = context.drizzle.contracts
    
        // this.handleMemberInputChange = this.handleMemberInputChange.bind(this)
        // this.handleMemberRoleChange = this.handleMemberRoleChange.bind(this);
        // this.handleMemberStatusChange = this.handleMemberStatusChange.bind(this);
    
        this.handleCreateButton = this.handleCreateButton.bind(this)   
        this.handleCreateRequestDialogClose = this.handleCreateRequestDialogClose.bind(this);
    
    
        this.state = {
          dialogCreateRequest: false,
          alertText: ''
        }
    
      }

    handleCreateButton() {
        this.setState({ dialogCreateRequest: true })
    }

    handleCreateRequestDialogClose() {
        this.setState({ dialogCreateRequest: false })
    }

  render() {

     /*
      <div className="pure-g">
        <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Network</h1>
            <p><Network /></p>
            <h1>RFAI Portal</h1>
            <p>RFAI Portal Description Goes Here.<br/>RFAI Portal Description Goes Here.<br/>RFAI Portal Description Goes Here.</p>
            <br/><br/>
        </div>
      </div>
*/ 

    return (
        <React.Fragment>
          <div>
            <div class="top-fold">
                <nav class="navbar navbar-singularity">
                    <a class="navbar-brand" href="#"><img src={logo} /></a>
                </nav>   
                <div class="main">
                    <div class="row">
                        <div class="col-7">
                            <h2>Request for AI</h2>
                            <p class="tagline">Lorem ipsum dolor sit amet, vim congue. </p>
                            <p>
                                Lorem ipsum dolor sit amet, sit an soluta audiam sanctus, ad eam partem perpetua recteque, sea ad nonumy nonumes.                    
                                Nam et equidem offendit signiferumque. 
                            </p>
                            <p>
                                Mea ei posse eleifend urbanitas
                                An vel alterum perpetua, ei est labores persequeris. Quo id inani congue, est ignota imperdiet cu, debet aliquid ne vis.                     
                            </p>                            
                        </div>
                        <div class="col-5"></div>
                    </div>
                    <button class="blue"  onClick = {this.handleCreateButton}>Create Request</button>
                    <button class="blue ml-4" onClick = {this.props.handlerViewPage}>View Request</button>
                </div> 
            </div>
            <div class="waves">
                <div class="waves-wrapper" >
                    <div class="waves-wrapper-svg">
                        <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" preserveAspectRatio="none">  
                        <path d="M 1014 264 v 122 h -808 l -172 -86 s 310.42 -22.84 402 -79 c 106 -65 154 -61 268 -12 c 107 46 195.11 5.94 275 137 z"></path>   
                        <path d="M -302 55 s 235.27 208.25 352 159 c 128 -54 233 -98 303 -73 c 92.68 33.1 181.28 115.19 235 108 c 104.9 -14 176.52 -173.06 267 -118 c 85.61 52.09 145 123 145 123 v 74 l -1306 10 z"></path>  
                        <path d="M -286 255 s 214 -103 338 -129 s 203 29 384 101 c 145.57 57.91 178.7 50.79 272 0 c 79 -43 301 -224 385 -63 c 53 101.63 -62 129 -62 129 l -107 84 l -1212 12 z"></path>  
                        <path d="M -24 69 s 299.68 301.66 413 245 c 8 -4 233 2 284 42 c 17.47 13.7 172 -132 217 -174 c 54.8 -51.15 128 -90 188 -39 c 76.12 64.7 118 99 118 99 l -12 132 l -1212 12 z"></path>  
                        <path d="M -12 201 s 70 83 194 57 s 160.29 -36.77 274 6 c 109 41 184.82 24.36 265 -15 c 55 -27 116.5 -57.69 214 4 c 49 31 95 26 95 26 l -6 151 l -1036 10 z"></path> 
                        </svg>                        
                    </div>
                </div>                
            </div>
            
          </div>


        <Dialog PaperProps={dialogStyles} open={this.state.dialogCreateRequest} >

        <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create Request</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCreateRequestDialogClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div class="clear"></div><br/>
                    </div>
                    <div class="modal-body">
                        <CreateRequest />
                    </div>
                    {/* <div class="modal-footer">
                        <button type="button" class="white" data-dismiss="modal">Close</button>
                        <button type="button" class="blue">Submit</button>
                    </div> */}
                </div>
            </div>


            
            {/* <p><Button variant="contained" onClick={this.handleCreateRequestDialogClose} >Close</Button></p> */}
        </Dialog>

        </React.Fragment>

    )
  }
}

LandingPage.contextTypes = {
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

export default drizzleConnect(LandingPage, mapStateToProps)
