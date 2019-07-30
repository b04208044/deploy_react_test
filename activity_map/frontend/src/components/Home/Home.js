import React, { Component } from "react";
import { Row, Container, Col } from "react-bootstrap";

class Home extends Component {
  render() {
    return (
      <Container style={{ paddingTop: "2vh" }}>
        <Col>
          <Row>
            <h3>網站介紹:</h3>
          </Row>
          <Row>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;總是不斷遇見與錯過， 失去連結，錯過緣分
              活動，搭建起與誰的橋梁 這裡，找到志同道合你與你
              尋覓到未來的夥伴，追尋到自己的方向 再這裡找到自己所愛的活動參加吧！
            </p>
          </Row>
          <Row>
            <p>
              網站理念
              希望可以蒐羅世界各地大大小小的活動，希冀藉由這樣子的活動平台，
              增進世界的資訊流通，這裡整合了許多各式各樣的活動，
              讓自己所愛的事務不再錯過。
            </p>
          </Row>
        </Col>
      </Container>
    );
  }
}

export default Home;
