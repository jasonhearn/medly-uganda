import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom"
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

    this.validateField = this.validateField.bind(this);

    this.state = {
      phone: '',
      phoneList: [],
      failed: false,
      phoneValid: false,
      data: {}
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
      .then(data => this.setState({ data : data.results }))
  }

  componentDidUpdate(prevProps,prevState) {
    var tmp_list = [] 

    if (prevState.data !== this.state.data) {
      for (var i=0; i<Object.keys(this.state.data).length; i++) {
        tmp_list[i] = this.state.data[i].urns[0].substr(4)
      }
      this.setState({ phoneList : tmp_list })
    }
  }

  clearLocal() {
    localStorage.clear();
  }

  handleChange(e) {
    if (e.target.value.length >= 7) {
      this.setState({ phone: e.target.value },
        () => {this.validateField(this.state.phone) });
    } else {
      this.setState({ 
        phoneValid: false,
        failed: false 
      })
    }
  }

  validateField(phone) { 
    var phoneValid = this.state.phoneValid
    var formError = this.state.formError

    if (phone.charAt(0) !== "+") {
      var area = "+1647"
      phone = area + phone
    }
    
    phoneValid = this.state.phoneList.indexOf(phone) > -1

    if (phone.length >= 12 && !phoneValid) {
      this.setState({ failed: true })
    }

    this.setState( { phone: phone,
                     formError: formError,
                     phoneValid: phoneValid })
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  render() {
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

export default PatSearch;
