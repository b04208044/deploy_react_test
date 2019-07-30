import React from "react";
import { Navbar, Nav } from "react-bootstrap"; //, NavDropdown
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import styles from "./HeaderNavBar.module.css";
import { slidewindowShow } from "../../redux/actions/index";


const mapStateToProps = state => {
  return { userid: state.userid };
};
function mapDispatchToProps(dispatch) {
  return {
    chickSlidewindowOpen: () => dispatch(slidewindowShow())
  };
}
class ConnectedHeaderNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  chickSlidewindowOpen=()=>{
    // console.log("Header Navlink clicked");
    this.props.chickSlidewindowOpen();
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" >
        <Navbar.Brand href="/" ><i className="fas fa-bullhorn fa-1x"> </i>活動通地圖</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="mr-auto">
              <NavLink to="/" activeStyle={{ color: "#fa923f" }} exact className={styles.navlink} onClick={this.chickSlidewindowOpen}>網站介紹</NavLink>
              <NavLink to="/info" activeStyle={{ color: "#fa923f" }} className={styles.navlink} onClick={this.chickSlidewindowOpen}>查看活動</NavLink>
              {/* <NavLink to="/xv18" activeStyle={{ color: "#fa923f" }} className={styles.navlink} onClick={this.chickSlidewindowOpen}>未開放功能</NavLink> */}
            {/* <NavDropdown title="更多的切換" id="basic-nav-dropdown" >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end" >
          <Navbar.Text>
            Signed in as:  <NavLink to="/authenticate" activeStyle={{ color: "#fa923f" }}>{this.props.userid?this.props.userid:"None"}</NavLink>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const HeaderNavBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedHeaderNavBar);
export default HeaderNavBar;