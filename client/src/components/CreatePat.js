import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Redirect } from "react-router-dom"
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Logos from "./Logos"
import LogoutButton from './LogoutButton'
import username from "../pictures/username.png"
import phone from "../pictures/phone.png"
import dob from "../pictures/dob.png"
import sex from "../pictures/sex.png"
import language from "../pictures/language.png"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import '../styles/main.css';
var dateFormat = require('dateformat')

class CreatePat extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.checkDate = this.checkDate.bind(this)

    this.state = { 
      success: false,
      phone: "",
      name: "",
      dob: "",
      sex: "",
      language: ""
    }
  }

  handleChange(e) {
    const name = e.target.name;
    var value = e.target.value;

    if (name === "phone") {
      var area = "+256"
      value = area + value.replace(/\s/g, '')
      console.log(value)
    }

    if (value.length < 3) {
      e.target.setCustomValidity("Invalid field.");
    } else {
      if (name === "phone") {
        if (value.length !== 13) {
          e.target.setCustomValidity("Invalid field.");
        } else {
          e.target.setCustomValidity("");
        }
      } else {
        e.target.setCustomValidity("");
      }
    }

    this.setState({ [name]: value })
  }

  checkDate(startDate) {
    var date = moment(startDate).format('YYYY-MM-DD');
    var regEx = /(19|20)\d{2}-(0\d{1}|1[0-2])-([0-2]\d{1}|3[0-1])/
    console.log('Format:' + (date.match(regEx)))
    if(!date.match(regEx)) {
      var x = false;  // Invalid format
    } else {
      var x = true;
    }
    console.log(x)
  }

  dateChange(startDate) {
    var date = moment(startDate).format('YYYY-MM-DD');
    this.setState({
      startDate: startDate,
      dob: date
    });
    //   document.getElementById('datePicker').setCustomValidity("");
    // } else {
    //   document.getElementById('datePicker').setCustomValidity("Invalid field.");
    // }
    
  }

  checkVal() {
    if(this.state.phone.length === 13 & 
      this.state.name !== "" &
      this.state.dob !== "" &
      this.state.sex !== "" &
      this.state.language !== "") {
      return true
    } else {
      return false
    }
  }

  dropMenu(id) {
    document.getElementById(id).setAttribute("class", "CreateDropdownContent");
  }

  hideMenu(id) {
    document.getElementById(id).setAttribute("class", "Hidden");
  }

  updVal(id,varName) {
    console.log(this.state[varName])
    document.getElementById(id).setAttribute("value", this.state[varName]);
  }

  createPat() {
    var registered_on = dateFormat((new Date(), "isoDateTime"))
    var registered_by = localStorage.getItem('username')

    var contObj = {
      name: this.state.name,
      phone: this.state.phone,
      DOB: this.state.dob,
      sex: this.state.sex,
      language: this.state.language,
      registered_on: registered_on,
      registered_by: registered_by
    };

    var payload = JSON.stringify(contObj)
    var token = localStorage.getItem('token');

    var request = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'
      },
      body: payload
    }

    fetch('/createPat', request)
      .then(res => {
        if (res.status === 200) {
          this.setState({ success: true })
        }
      })
  }

  render() {
    if (this.state.success) {
      return <Redirect push to="/patientsearch" />;
    } else {      
      return (
        <main>
          <div className="MiddleTop">
            <div className="Logout">
              <LogoutButton />
            </div>
          </div>
          <div className="Middle">
            <h1>Enter the patient's information.</h1>
            
            <div className="CreateBlock">
              <FormGroup className="CreateForm">
                <ControlLabel>
                  <img 
                    src={username} 
                    className='CreateIcon' 
                    alt="" 
                  />
                </ControlLabel>
                <FormControl
                  autoFocus
                  name="name"
                  type="text"
                  id="usernameForm"
                  placeholder="Name"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup className="CreateFormPhone">
                <ControlLabel>
                  <img 
                    src={phone} 
                    className='CreateIcon' 
                    alt="" 
                    style = {{marginRight: '10px'}}
                  />
                  <p>+256</p>
                </ControlLabel>
                <FormControl
                  name="phone"
                  type="text"
                  placeholder="Phone number (720123456)"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup className="CreateFormDate">
                <img 
                  src={dob} 
                  className='CreateIcon'
                  style={{float: 'left', marginLeft: '12px', marginRight: '8px'}}
                  alt="" 
                />
                <DatePicker
                  id="datePicker"
                  dateFormat="DD/MM/YYYY"
                  selected={this.state.startDate}
                  onSelect={this.checkDate}
                  onChange={this.dateChange}
                  placeholderText="Date of birth (DD/MM/YYYY)"
                />
              </FormGroup>

              <FormGroup className="CreateForm">
                <img 
                  src={sex} 
                  className='CreateIcon'
                  alt="" 
                />
                <div className="CreateDropdown">
                  <Button className="CreateDropButton" id="sexButton" onClick={() => { this.dropMenu("sex") }}>Sex</Button>
                  <div className="Hidden" id="sex" style={{height: '48px'}}>
                    <li onClick={() => { 
                      this.setState({sex: 'M'})
                      document.getElementById("sexButton").style.color = '#000000';
                      document.getElementById("sexButton").firstChild.data = "Male";
                      this.hideMenu("sex")
                    }}>Male</li>
                    <li onClick={() => { 
                      this.setState({sex: 'F'})
                      document.getElementById("sexButton").style.color = '#000000';
                      document.getElementById("sexButton").firstChild.data = "Female";
                      this.hideMenu("sex")
                    }}>Female</li>
                  </div>
                </div>
              </FormGroup>

              <FormGroup className="CreateForm">
                <img 
                  src={language} 
                  className='CreateIcon'
                  alt="" 
                />
                <div className="CreateDropdown">
                  <Button className="CreateDropButton" 
                    id="languageButton" 
                    onClick={() => { this.dropMenu("language") }}>Language
                  </Button>
                  <div className="Hidden" id="language" style={{height: '72px'}}>
                    <li onClick={() => { 
                      this.setState({language: 'eng'})
                      document.getElementById("languageButton").style.color = '#000000';
                      document.getElementById("languageButton").firstChild.data = "English";
                      this.hideMenu("language")
                    }}>English</li>
                    <li onClick={() => { 
                      this.setState({language: 'lug'})
                      document.getElementById("languageButton").style.color = '#000000';
                      document.getElementById("languageButton").firstChild.data = "Luganda";
                      this.hideMenu("language")
                    }}>Luganda</li>
                    <li onClick={() => { 
                      this.setState({language: 'laj'})
                      document.getElementById("languageButton").style.color = '#000000';
                      document.getElementById("languageButton").firstChild.data = "Runyankore";
                      this.hideMenu("language")
                    }}>Runyankore</li>
                  </div>
                </div>
              </FormGroup>
            </div>

            <Button 
              className="CreateButton" 
              disabled={!this.checkVal()}
              onClick={() => { 
                this.createPat() 
                this.setState({ success: true })
              }}
            >
              OK
            </Button>

            <Logos />

          </div>
        </main>
      );
    }
  }
}

export default CreatePat;