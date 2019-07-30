import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import { connect } from "react-redux";

import styles from "./App.module.css";
import HeaderNavBar from "./HeaderNavBar/HeaderNavBar";
import SlideInfo from "./SlideInfo/SlideInfo";
import Map from "./MapWindow/MapWindow";
import Home from "../components/Home/Home";
import Authenticate from "./Authenticate/Authenticate"
import { slidewindowToggle,slidewindowShow } from "../redux/actions/index";

const mapStateToProps = state => {
  return { 
    isSlidewindowShow: state.isSlidewindowShow ,
    selcetFeatureInfo: state.selcetFeatureInfo
  };
};

function mapDispatchToProps(dispatch) {
  return {
    chickSlidewindowToggle: () => dispatch(slidewindowToggle()),
    chickSlidewindowOpen: () => dispatch(slidewindowShow())
  };
}

class ConnectedApp extends Component {
  slidewindowToggle() {
    let slidewindow = document.getElementById("slidewindow");
    let slideBtn = document.getElementById("slideBtn");
    if (this.props.isSlidewindowShow === 0) {
      slidewindow.classList.remove(styles.slidewindowClose);
      slideBtn.classList.remove(styles.slideBtnClose);
      slidewindow.classList.add(styles.slidewindow);
      slideBtn.classList.add(styles.slideBtn);
      slideBtn.innerHTML = "<i class='fas fa-angle-double-right'></i>";
    } else {
      slidewindow.classList.remove(styles.slidewindow);
      slideBtn.classList.remove(styles.slideBtn);
      slidewindow.classList.add(styles.slidewindowClose);
      slideBtn.classList.add(styles.slideBtnClose);
      slideBtn.innerHTML = "<i class='fas fa-angle-double-left'></i>";
    }
  }

  slideBtnClick() {
    this.slidewindowToggle();
    this.props.chickSlidewindowToggle();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isSlidewindowShow === 1 && document.getElementById("slidewindow").className === styles.slidewindowClose) {
      this.slidewindowToggle();
    }
    if (this.props.selcetFeatureInfo!==nextProps.selcetFeatureInfo){
      this.props.chickSlidewindowOpen();
    }
    return false;
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/authenticate" component={Authenticate} />
            <Route
              render={() => (
                <div>
                  <div className={styles.mainwindow}>
                    <Map />
                  </div>
                  <div className={styles.slidewindow} id="slidewindow">
                    <Container>
                      <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/info" component={SlideInfo} />
                        <Route render={() => <div>尚未開放功能</div>} />
                      </Switch>
                    </Container>
                  </div>

                  <div
                    id="slideBtn"
                    className={styles.slideBtn}
                    onClick={() => this.slideBtnClick()}
                  >
                    <i className="fas fa-angle-double-right" />
                  </div>
                </div>
              )}
            />
          </Switch>
          
          <HeaderNavBar />
          <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            fixed="bottom"
            className={styles.bottom}
          ><span>
             Developer:林承恩、周宇宸、饒孝天&nbsp;&nbsp;Data from : 行政院文化部開放資料、OSM、Google API &nbsp;&nbsp;圖片來源:irasutoya
             </span>
          </Navbar>
        </BrowserRouter>
      </div>
    );
  }
}
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedApp);
export default App;
