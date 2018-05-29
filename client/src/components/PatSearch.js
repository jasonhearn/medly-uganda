import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom"
import Logos from "./Logos"
import LogoutButton from './LogoutButton'
import phone from "../pictures/phone.png"
import error from "../pictures/error.png"
import '../styles/main.css';

class ErrorMessage extends Component {
  render() {
    if (this.props.failed) {
      return(
        <div className='Error'>
          <img 
            src={error} 
            className='ErrorIcon' 
            alt="" 
          />
          Phone number not in database.
        </div>
      );
    } else {
      return(
        <div className='Error'> </div>
    )}
  }
}

class NewClinicianButton extends Component {
  render() {
    return(
      <Link to={'/createclinician'}>
        <Button 
          className="ChangePtButton" 
          type="submit" 
        >
          Add clinician
        </Button>
      </Link>
    )
  }
}

class PatSearch extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.validateField = this.validateField.bind(this);

    this.state = {
      phone: '',
      phoneList: [],
      success: false,
      failed: false,
      phoneValid: false,
    };
  }

  componentDidMount() {
    var url = '/getAllContacts'
    var token = localStorage.getItem('token');
    var request = {
      headers: {
        'Authorization': 'Bearer '+token
      }
    }

    fetch(url,request)
      .then(res => res.json())
      .then(data => {
        var phone_list = []
        for (var i=0; i<data.length; i++) {
          phone_list[i] = data[i].phone
        }
        this.setState({ 
          phoneList : phone_list,
        })
      })
  }

  clearLocal() {
    localStorage.clear();
  }

  handleChange(e) {
    var val = e.target.value.replace(" ", "")
    if (val.substr(0,4) === "+256") { 
      // Do nothing
    } else if (val.substr(0,3) === "256") {
      val = "+" + val
    } else {
      val = "+256" + val
    }

    if (val.length >= 13) {
      console.log(val)
      this.setState({ phone: val },
        () => {this.validateField(this.state.phone) });
    } else {
      this.setState({ 
        phoneValid: false,
        failed: false 
      })
    }
  }

  keyPress(e) {
    if (e.key === 'Enter') {
      if (this.state.phoneValid) {
        this.setState({ success: true }); 
      } else {
        e.preventDefault();
        this.setState({ failed: true })
      }
    }
  }

  validateField(phone) { 
    var phoneValid = this.state.phoneValid
    var formError = this.state.formError
    
    // Check for match in phone list
    phoneValid = this.state.phoneList.indexOf(phone) > -1

    if (phone.length >= 13 && !phoneValid) {
      this.setState({ failed: true })
    } else {
      this.setState({ failed: false })
    }

    this.setState( { phone: phone,
                     formError: formError,
                     phoneValid: phoneValid })
  }

  render() {
    if (this.state.success) {
      return <Redirect push to={'/patient/' + this.state.phone} />;
    } else {
      return (
        <main>
          <div className="MiddleTop">
            <header>
              <div className="Logout">
                <NewClinicianButton />
                <LogoutButton />
              </div>
            </header>
          </div>
          <div className="Middle">

            <h1>Enter your patient&#39;s phone number.</h1>

            <div className="LoginBlock">
              <form>
                <FormGroup 
                  className="MainFormPhone"
                >
                  <ControlLabel>
                    <img 
                      src={phone} 
                      className='Icon' 
                      alt="" 
                      style = {{marginRight: '10px'}}
                    />
                    <p>+256</p>
                  </ControlLabel>
                  <FormControl
                    autoFocus
                    type="text"
                    placeholder="720123456"
                    onChange={this.handleChange}
                    onKeyPress={this.keyPress}
                  />
                </FormGroup>

              </form>

            </div>

            <Link to={'/patient/' + this.state.phone}>
              <Button className="HorizButton" 
                type="submit" 
                disabled={!this.state.phoneValid}
              >
                OK
              </Button>
            </Link>

            <ErrorMessage failed={this.state.failed} />

            <h2>Patient not in the system? <Link to='/createpatient' className='Link'>Add a new patient</Link>.</h2>

            <h2>Don't know the phone number? <Link to='/patientbrowse' className='Link'>Browse your patients</Link>.</h2>
            
            <Logos />

          </div>
        </main>
      );
    }
  }
}

export default PatSearch;
