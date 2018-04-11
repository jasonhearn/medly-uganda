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
      value = area + value
    }

    this.setState({ [name]: value })
  }

  dateChange(startDate) {
    var date = moment(startDate).format('YYYY-MM-DD');
    this.setState({
      startDate: startDate,
      dob: date
    });
  }

  checkVal() {
    if(this.state.phone !== "" & 
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
    console.log(token)

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
          this.setState({ saved: true })
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
                  placeholder="Name"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup className="CreateForm">
                <ControlLabel>
                  <img 
                    src={phone} 
                    className='CreateIcon' 
                    alt="" 
                  />
                </ControlLabel>
                <FormControl
                  autoFocus
                  name="phone"
                  type="text"
                  placeholder="Phone number"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup className="CreateForm">
                <img 
                  src={dob} 
                  className='CreateIcon'
                  style={{float: 'left', marginLeft: '12px'}}
                  alt="" 
                />
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  selected={this.state.startDate}
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
                  <div className="Hidden" id="sex">
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
                  <Button className="CreateDropButton" id="languageButton" onClick={() => { this.dropMenu("language") }}>Language</Button>
                  <div className="Hidden" id="language">
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