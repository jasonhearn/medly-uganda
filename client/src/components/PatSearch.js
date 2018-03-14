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
      phoneList: [],
      success: false,
      failed: false,
      phoneValid: false,
    };
  }

  componentDidMount() {
    var url = '/contAll'
    var token = localStorage.getItem('token');
    var request = {
      headers: {
        'Authorization': 'Bearer '+token
      }
    }

    fetch(url,request)
      .then(res => res.json())
      .then(data => { 
        var tmp_list = []
        for (var i=0; i<Object.keys(data.results).length; i++) {
          tmp_list[i] = data.results[i].urns[0].substr(4)
        }
        this.setState({ phoneList : tmp_list })
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

            <Link to={'/patient/' + this.state.phone}>
              <Button className="HorizButton" 
                type="submit" 
                disabled={!this.state.phoneValid}
              >
                OK
              </Button>
            </Link>

            <ErrorMessage failed={this.state.failed} />

            <h2>Don't know the phone number? <Link to='/patbrowse' className='Link'>Browse your patients</Link>.</h2>
            
            <Logos />

          </div>
        </main>
      );
    }
  }
}

export default PatSearch;
