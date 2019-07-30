import React, { Component } from "react";
import {
  Form,
  Col,
  Button,
  Container,
  Card,
  Image,
  Row
} from "react-bootstrap";
import { GraphQLClient } from "graphql-request";
import styles from "./Authenticate.module.css";
import { connect } from "react-redux";
import { userIDupdata, tokenUpdata } from "../../redux/actions/index";

var token = "";
const serverURL = "http://localhost:8787/api";
const client = new GraphQLClient(serverURL, {
  headers: { Authorization: token, "Content-Type": "application/json" },
  mode: "cors"
});
const loginQuery = `
    query ($id: String!, $pw: String!) {
      login(id: $id, pw: $pw) 
    }
  `;
const createUserQuery = `
    mutation ($id: String!, $pw: String!) {
        createUser(id: $id, pw: $pw)
    }
`;

const mapStateToProps = state => {
  return { userid: state.userid };
};
function mapDispatchToProps(dispatch) {
  return {
    userIDupdata: e => dispatch(userIDupdata(e)),
    tokenUpdata: e => dispatch(tokenUpdata(e))
  };
}
class ConnectedAuthenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSingUp: 0,
      formID: "",
      formPassword: "",
      formPasswordcheck: "",
      alerttext: ""
    };
  }

  handleFormSubmit = async e => {
    e.preventDefault();
    if (this.state.formID === "") {
      this.setState({
        alerttext: "請輸入帳號",
        formPassword: "",
        formPasswordcheck: ""
      });
      return;
    }
    if (this.state.formPassword === "") {
      this.setState({
        alerttext: "請輸入密碼"
      });
      return;
    }
    if (this.state.formPassword.length < 8) {
      this.setState({
        alerttext: "密碼長度請大於8碼",
        formPassword: "",
        formPasswordcheck: ""
      });
      return;
    }
    if (this.state.isSingUp === 1) {
      if (this.state.formPasswordcheck === "") {
        this.setState({
          alerttext: "請輸入確認密碼",
          formPassword: "",
          formPasswordcheck: ""
        });
        return;
      }
      if (this.state.formPasswordcheck !== this.state.formPassword) {
        this.setState({
          alerttext: "兩次密碼不符",
          formPassword: "",
          formPasswordcheck: ""
        });
        return;
      }
    }

    if (this.state.isSingUp === 0) {
      client
        .request(loginQuery, {
          id: this.state.formID,
          pw: this.state.formPassword
        })
        .then(result => {
          token = result.login;
          if (!token) {
            this.setState({
              alerttext: "帳號或密碼錯誤",
              formPassword: "",
              formPasswordcheck: ""
            });
          } else {
            this.props.userIDupdata(this.state.formID);
            this.props.tokenUpdata(token);
            this.setState({
              formID: "",
              formPassword: "",
              formPasswordcheck: "",
              alerttext: ""
            });
            this.props.history.push("/info");
          }
        });
    } else {
      client
        .request(createUserQuery, {
          id: this.state.formID,
          pw: this.state.formPassword
        })
        .then(result => {
          token = result.createUser;
          console.log(token)
          if (!token) {
            this.setState({
              alerttext: "帳號重複囉",
              formID: "",
              formPassword: "",
              formPasswordcheck: ""
            });
          } else {
            this.props.userIDupdata(this.state.formID);
            this.props.tokenUpdata(token);
            this.setState({
              formID: "",
              formPassword: "",
              formPasswordcheck: "",
              alerttext: ""
            });
            this.props.history.push("/info");
          }
        });
    }
  };

  toggleSingup = () => {
    this.setState({
      formPassword: "",
      formPasswordcheck: "",
      alerttext: ""
    });
    this.state.isSingUp === 0
      ? this.setState({ isSingUp: 1 })
      : this.setState({ isSingUp: 0 });
  };

  signOut = () => {
    //! 登出設定
    this.props.userIDupdata("");
    this.props.tokenUpdata("");
    window.location.reload(true);
  };

  cancelSignOut = () => {
    this.props.history.push("/info");
  };

  render() {
    if (this.props.userid) {
      //登出
      return (
        <div style={{ backgroundColor: "rgb(170, 211, 223)" }}>
          <Container className={styles.base}>
            <Image
              src={require("../../img/OSM.png")}
              fluid
              className={styles.img}
            />
            <Col lg="10" className={styles.card}>
              <Card>
                <Card.Body>
                  <div>
                    <Row style={{ justifyContent: "center" }}>
                      <h4>確定要登出嗎?</h4>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                      <Button
                        variant="info"
                        type="submit"
                        onClick={this.signOut}
                      >
                        登出
                      </Button>
                      &nbsp;
                      <Button
                        variant="secondary"
                        type="submit"
                        onClick={this.cancelSignOut}
                      >
                        取消
                      </Button>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Container>
        </div>
      );
    }
    if (this.state.isSingUp === 0) {
      //登入
      return (
        <div style={{ backgroundColor: "rgb(170, 211, 223)" }}>
          <Container className={styles.base}>
            <Image
              src={require("../../img/OSM.png")}
              fluid
              className={styles.img}
            />
            <Col lg="10" className={styles.card}>
              <Card>
                <Card.Header as="h5">使用者登入</Card.Header>
                <Card.Body>
                  <div>
                    <Form>
                      <Form.Group controlId="formBasicUserID">
                        <Form.Label>輸入帳號</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Your ID"
                          value={this.state.formID}
                          onChange={e => {
                            this.setState({
                              formID: e.target.value
                            });
                          }}
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>輸入密碼</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={this.state.formPassword}
                          onChange={e => {
                            this.setState({
                              formPassword: e.target.value
                            });
                          }}
                          title="密碼長度需大於8碼"
                          onPaste={e => e.preventDefault()}
                          onCopy={e => e.preventDefault()}
                          onCut={e => e.preventDefault()}
                          onContextMenu={e => e.preventDefault()}
                        />
                      </Form.Group>
                      <div className={styles.alerttext}>
                        {this.state.alerttext}
                      </div>
                      <Button
                        variant="info"
                        type="submit"
                        onClick={this.handleFormSubmit}
                      >
                        登入
                      </Button>
                      <div className={styles.smalltext}>
                        沒有帳號嗎?&nbsp;
                        <Button
                          variant="secondary"
                          className={styles.smallBtn}
                          size="sm"
                          onClick={this.toggleSingup}
                        >
                          註冊帳號
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Container>
        </div>
      );
    } else {
      //註冊
      return (
        <div style={{ backgroundColor: "rgb(170, 211, 223)" }}>
          <Container className={styles.base}>
            <Image
              src={require("../../img/OSM.png")}
              fluid
              className={styles.img}
            />
            <Col lg="10" className={styles.card}>
              <Card>
                <Card.Header as="h5">註冊帳號</Card.Header>
                <Card.Body>
                  <div>
                    <Form>
                      <Form.Group controlId="formBasicUserID">
                        <Form.Label>輸入帳號</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Your ID"
                          value={this.state.formID}
                          onChange={e => {
                            this.setState({
                              formID: e.target.value
                            });
                          }}
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>輸入密碼</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={this.state.formPassword}
                          onChange={e => {
                            this.setState({
                              formPassword: e.target.value
                            });
                          }}
                          title="密碼長度需大於8碼"
                          onPaste={e => e.preventDefault()}
                          onCopy={e => e.preventDefault()}
                          onCut={e => e.preventDefault()}
                          onContextMenu={e => e.preventDefault()}
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicPasswordcheck">
                        <Form.Label>密碼確認</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={this.state.formPasswordcheck}
                          onChange={e => {
                            this.setState({
                              formPasswordcheck: e.target.value
                            });
                          }}
                          title="密碼長度需大於8碼"
                          onPaste={e => e.preventDefault()}
                          onCopy={e => e.preventDefault()}
                          onCut={e => e.preventDefault()}
                          onContextMenu={e => e.preventDefault()}
                        />
                      </Form.Group>
                      <div className={styles.alerttext}>
                        {this.state.alerttext}
                      </div>
                      <Button
                        variant="info"
                        type="submit"
                        onClick={this.handleFormSubmit}
                      >
                        註冊
                      </Button>
                      <div className={styles.smalltext}>
                        已經有帳號了嗎?&nbsp;
                        <Button
                          variant="secondary"
                          size="sm"
                          className={styles.smallBtn}
                          onClick={this.toggleSingup}
                        >
                          返回登入畫面
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Container>
        </div>
      );
    }
  }
}

const Authenticate = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedAuthenticate);
export default Authenticate;
