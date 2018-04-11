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

class PatSearch extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.validateField = this.validateField.bind(this);

    this.state = {
      phone: '',
      uuid: '',
      phoneList: [],
      uuidList: [],
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
        var phone_list = [], uuid_list = []
        for (var i=0; i<data.length; i++) {
          phone_list[i] = '+'+data[i].phone
          uuid_list[i] = data[i].uuid
        }
        this.setState({ 
          phoneList : phone_list,
          uuidList : uuid_list 
        })
      })
  }

  clearLocal() {
    localStorage.clear();
  }

  handleChange(e) {
    var val = e.target.value.replace(" ", "")
    if (val >= 7) {
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

    // Add area code if not already present
    if (phone.charAt(0) !== "+") {
      var area = "+256"
      phone = area + phone
    }
    
    // Check for match in phone list
    phoneValid = this.state.phoneList.indexOf(phone) > -1

    // Get matching UUID for phone number
    var uuid;
    if (phoneValid) {
      uuid = this.state.uuidList[this.state.phoneList.indexOf(phone)]
    } else {
      uuid = ""
    }

    if (phone.length >= 13 && !phoneValid) {
      this.setState({ failed: true })
    } else {
      this.setState({ failed: false })
    }

    this.setState( { phone: phone,
                     uuid: uuid,
                     formError: formError,
                     phoneValid: phoneValid })
  }

  render() {
    if (this.state.success) {
      return <Redirect push to={'/patient/' + this.state.uuid} />;
    } else {
      return (
        <main>
          <div className="MiddleTop">
            <div className="Logout">
              <LogoutButton />
            </div>
          </div>
          <div className="Middle">

            <h1>Enter your patient&#39;s phone number.</h1>

            <div className="LoginBlock">
              <form>
                <FormGroup 
                  className="MainForm"
                >
                  <ControlLabel>
                    <img 
                      src={phone} 
                      className='Icon' 
                      alt="" 
                    />
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

            <Link to={'/patient/' + this.state.uuid}>
              <Button className="HorizButton" 
                type="submit" 
                disabled={!this.state.phoneValid}
              >
                OK
              </Button>
            </Link>

            <ErrorMessage failed={this.state.failed} />

            <h2>Patient not in system? <Link to='/createpatient' className='Link'>Add a new patient</Link>.</h2>

            <h2>Don't know the phone number? <Link to='/patientbrowse' className='Link'>Browse your patients</Link>.</h2>
            
            <Logos />

          </div>
        </main>
      );
    }
  }
}

export default PatSearch;
