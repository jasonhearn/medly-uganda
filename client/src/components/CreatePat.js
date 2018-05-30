import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Redirect } from "react-router-dom"
import Logos from "./Logos"
import LogoutButton from './LogoutButton'
import ReturnButton from './ReturnButton'
import username from "../pictures/username.png"
import phone from "../pictures/phone.png"
import DOB from "../pictures/dob.png"
import sex from "../pictures/sex.png"
import language from "../pictures/language.png"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import '../styles/main.css';
var dateFormat = require('dateformat')

class CreatePat extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.checkDate = this.checkDate.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = { 
      success: false,
      phone: "",
      surname: "",
      firstname: "",
      dob: "",
      sex: "",
      language: ""
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    if (node !== null) {
      if (node.id === "sex") {
        this.wrapperSex  = node
      } else if (node.id === "language") {
        this.wrapperLang = node;
      }
    }
  }

  handleClickOutside(event) {
    if (!this.wrapperSex.contains(event.target) && !this.wrapperLang.contains(event.target)) {
      var sexStatus = document.getElementById("sex").getAttribute("class")
      var langStatus = document.getElementById("language").getAttribute("class")
      if (sexStatus !== "Hidden" | langStatus !== "Hidden") {
        document.getElementById("sex").setAttribute("class","Hidden")
        document.getElementById("language").setAttribute("class","Hidden")
      } 
    }
  }

  handleChange(e) {
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    const name = e.target.name;
    var value = e.target.value;

    if (name === "phone") {
      var area = "+256"
      value = area + value.replace(/\s/g, '')
    }

    if (name === "firstname") {
      if (value.length < 2) {
        e.target.setCustomValidity("Invalid field.");
      } else {
        value = toTitleCase(value)
        e.target.setCustomValidity("");
      }
    }

    if (name === "surname") {
      if (value.length < 2) {
        e.target.setCustomValidity("Invalid field.");
      } else {
        value = value.toUpperCase()
        e.target.setCustomValidity("");
      }
    }

    if (name === "phone") {
      if (value.length !== 13) {
        e.target.setCustomValidity("Invalid field.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    this.setState({ [name]: value })
  }

  checkDate(e) {
    const id = e.target.id;
    var value  = e.target.value;
    var regEx, expLen;

    if (id === "dd") {
      regEx  = /([0-2]\d{1}|3[0-1])/
      expLen = 2 
    } else if (id === "mm") {
      regEx = /(0\d{1}|1[0-2])/
      expLen = 2
    } else {
      regEx = /(19|20)\d{2}/
      expLen = 4
    }
    if(!value.match(regEx) || !(value.length === expLen)) {
      e.target.setCustomValidity("Invalid field.");
    } else {
      e.target.setCustomValidity("");
    }
    if (document.getElementById("dd").value.length === 2 &
        document.getElementById("mm").value.length === 2 &
        document.getElementById("yyyy").value.length === 4 &
        document.getElementById("dd").checkValidity() &
        document.getElementById("mm").checkValidity() &
        document.getElementById("yyyy").checkValidity()) {
      var date = document.getElementById("yyyy").value+"-"+document.getElementById("mm").value+"-"+document.getElementById("dd").value
      this.setState({ dob: date })
    }
  }

  checkAll() {
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
    document.getElementById(id).setAttribute("value", this.state[varName]);
  }

  createPat() {
    var registered_on = dateFormat((new Date(), "isoDateTime"))
    var registered_by = localStorage.getItem('username')

    var contObj = {
      surname: this.state.surname,
      firstname: this.state.firstname,
      phone: this.state.phone,
      dob: this.state.dob,
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
        } else if (res.status === 400) {
          this.setState({ success: true }) // Here, contact exists. For testing, we will just proceed to patient's page.
                                           // In future, we can have a pop-up that says "Patient already exists. You have been taken to their existing file."
        }
      })
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
                <ReturnButton />
                <LogoutButton />
              </div>
            </header>
          </div>
          <div className="Middle">
            <h1>Enter the patient's information.</h1>
            
            <div className="CreateBlock">
              <FormGroup className="CreateFormName">
                <ControlLabel>
                  <img 
                    src={username} 
                    className='CreateIcon' 
                    alt="" 
                    style = {{marginLeft: '0px'}}
                  />
                </ControlLabel>
                <FormControl
                  id="surname"
                  name="surname"
                  type="text"
                  placeholder="Surname"
                  onChange={this.handleChange}
                  style = {{marginLeft: '10px'}}
                />
                <FormControl
                  id="firstname"
                  name="firstname"
                  type="text"
                  placeholder="First name"
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
                <ControlLabel>
                  <img 
                    src={DOB} 
                    className='CreateIcon' 
                    alt="" 
                    style = {{marginLeft: '0px', marginRight: '10px'}}
                  />
                <p>DOB:</p>
                </ControlLabel>
                <FormControl
                  id="dd"
                  type="text"
                  placeholder="DD"
                  onChange={this.checkDate}
                  style = {{marginLeft: '8px'}}
                />
                <FormControl
                  id="mm"
                  type="text"
                  placeholder="MM"
                  onChange={this.checkDate}
                />
                <FormControl
                  id="yyyy"
                  type="text"
                  placeholder="YYYY"
                  onChange={this.checkDate}
                />
              </FormGroup>

              <FormGroup className="CreateForm">
                <img 
                  src={sex} 
                  className='CreateIcon'
                  alt="" 
                />
                <div className="CreateDropdown">
                  <Button className="CreateDropButton" 
                    id="sexButton" 
                    onClick={() => { this.dropMenu("sex") }}>
                    Sex
                  </Button>
                  <div className="Hidden" id="sex" ref={this.setWrapperRef} style={{height: '48px'}}>
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
                    onClick={() => { this.dropMenu("language") }}>
                    Language
                  </Button>
                  <div className="Hidden" id="language" ref={this.setWrapperRef} style={{height: '72px'}}>
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
              disabled={!this.checkAll()}
              onClick={() => { 
                this.createPat()
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