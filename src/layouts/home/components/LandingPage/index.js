import React, { Component } from 'react'
import logo from '../../../../images/Logo.png'
import settingimg from '../../../../images/settings.svg'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton'

// import components
import CreateRequest from '../../components/CreateRequest'
import MyAccount from '../../components/MyAccount'
import Administration from '../../components/Administration'

const dialogStyles = {
    style: {
      backgroundColor: 'white',
      padding: 5
    }
  }

const buttonStyles = {
    margin: 2,
  }

class LandingPage extends Component {

    constructor(props, context) {
        super(props)
    
        this.contracts = context.drizzle.contracts    

        this.handleCreateButton = this.handleCreateButton.bind(this)   
        this.handleCreateRequestDialogClose = this.handleCreateRequestDialogClose.bind(this);
    
        this.handleMyAccountButton = this.handleMyAccountButton.bind(this)   
        this.handleMyAccountDialogClose = this.handleMyAccountDialogClose.bind(this);

        this.handleAdminButton = this.handleAdminButton.bind(this)   
        this.handleAdminDialogClose = this.handleAdminDialogClose.bind(this);
    
        this.state = {
          dialogCreateRequest: false,
          dialogMyAccount: false,
          dialogAdmin: false,
          anchorEl: null,
          alertText: ''
        }

      }

    handleCreateButton() {
        this.setState({ dialogCreateRequest: true })
    }

    handleCreateRequestDialogClose() {
        this.setState({ dialogCreateRequest: false })
    }

    handleMyAccountButton() {
        this.setState({ anchorEl: null });
        this.setState({ dialogMyAccount: true })
    }

    handleMyAccountDialogClose() {
        this.setState({ dialogMyAccount: false })
    }

    handleAdminButton() {
        this.setState({ anchorEl: null });
        this.setState({ dialogAdmin: true })
    }

    handleAdminDialogClose() {
        this.setState({ dialogAdmin: false })
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
      };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    
  render() {

    const { anchorEl } = this.state;

    return (
        <React.Fragment>
          <div>
            <div className="top-fold">
                <nav className="navbar navbar-singularity">
                    <div className="col-8">
                        <a className="navbar-brand" href="https://singularitynet.io/" target="_new"><img src={logo} alt="logo"/></a>
                    </div>
                    <div className="col-4" style={{ 'text-align': 'right', 'margin-left':'auto', 'margin-right':'0', 'float': 'right',}}>
                            <IconButton className={buttonStyles} aria-label="Delete" aria-owns={anchorEl ? 'simple-menu' : undefined} onClick={this.handleClick} aria-haspopup="true" >
                                <img src={settingimg} alt="settings"/> 
                            </IconButton>

                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.handleClose}
                            >
                            <MenuItem onClick={this.handleMyAccountButton}>My account</MenuItem>
                            <MenuItem onClick={this.handleAdminButton}>Administration</MenuItem>
                            </Menu>

                    </div>
                </nav>  
                <div className="main">
                    <div className="row">
                        <div className="col-7">
                            <h2>Request for AI</h2>
                            <p className="tagline">Lorem ipsum dolor sit amet, vim congue. </p>
                            <p>
                                Lorem ipsum dolor sit amet, sit an soluta audiam sanctus, ad eam partem perpetua recteque, sea ad nonumy nonumes.                    
                                Nam et equidem offendit signiferumque. 
                            </p>
                            <p>
                                Mea ei posse eleifend urbanitas
                                An vel alterum perpetua, ei est labores persequeris. Quo id inani congue, est ignota imperdiet cu, debet aliquid ne vis.                     
                            </p>                            
                        </div>
                        <div className="col-5"></div>
                    </div>
                    <button className="blue"  onClick = {this.handleCreateButton}>Create Request</button>
                    <button className="blue ml-4" onClick = {this.props.handlerViewPage}>View Request</button>
                </div> 
            </div>
            <div className="waves">
                <div className="waves-wrapper" >
                    <div className="waves-wrapper-svg">
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

            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Create Request</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCreateRequestDialogClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="clear"></div><br/>
                    </div>
                    <div className="modal-body">
                        <CreateRequest />
                    </div>
                    {/* <div className="modal-footer">
                        <button type="button" className="white" data-dismiss="modal">Close</button>
                        <button type="button" className="blue">Submit</button>
                    </div> */}
                </div>
            </div>
            {/* <p><Button variant="contained" onClick={this.handleCreateRequestDialogClose} >Close</Button></p> */}
        </Dialog>

        <Dialog PaperProps={dialogStyles} open={this.state.dialogMyAccount} >

            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">My Account</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleMyAccountDialogClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="clear"></div><br/>
                    </div>
                    <div className="modal-body">
                        <MyAccount />
                    </div>
                </div>
            </div>
        </Dialog>

        <Dialog PaperProps={dialogStyles} open={this.state.dialogAdmin} >

            <div  role="document"> {/* className="modal-dialog" */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">RFAI Contract Administration</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleAdminDialogClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="clear"></div><br/>
                    </div>
                    <div className="modal-body">
                        <Administration />
                    </div>
                </div>
            </div>
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
