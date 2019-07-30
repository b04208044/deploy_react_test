import React, { Component } from "react";
import { Container, Image, Col } from "react-bootstrap";

import styles from "./SlideInfo.module.css";
import { connect } from "react-redux";
import { showFeatureInfo } from "../../redux/actions/index";
import {GraphQLClient} from 'graphql-request'

const dbURL = 'http://localhost:8787/api'
const likeQuery = `
  mutation($postID: String!, $liker: String!) {
      likePost(postID: $postID, liker: $liker)
  }
`

const mapStateToProps = state => {
  return { 
    selcetFeatureInfo: state.selcetFeatureInfo,
    userid: state.userid,
    token: state.token
  };
};
function mapDispatchToProps(dispatch) {
  return {
    showFeatureInfo: info => dispatch(showFeatureInfo(info))
  };
}
class ConnectedSlideInfo extends Component {

  constructor(props) {
    super(props);

    this.state = { likeChange: 0 };
  }

  likeplus= async () => {
    const client = new GraphQLClient(dbURL, {headers:{Authorization: this.props.token}})
    if(!this.props.userid){
      alert("您尚未登入喔")
      return;
    }

    if(!this.props.selcetFeatureInfo){
      console.log("未獲取點資料")
      return;
    }

    const likes = await client.request(likeQuery, {postID: this.props.selcetFeatureInfo[0], liker: this.props.userid})
    if(this.props.selcetFeatureInfo[6] > likes.likePost){
      alert("您已取消對本活動的讚 :(")
    }
    const newFeatureInfo = this.props.selcetFeatureInfo;
    newFeatureInfo[6] = likes.likePost
    this.props.showFeatureInfo(newFeatureInfo)
    this.setState((e)=>({likeChange: e.likeChange+1}))
  }


  render() {
    let display = null;
    if (!this.props.selcetFeatureInfo) {
      display = (
        <Col style={{ paddingTop: "10vh" }}>
          <Image src={require("../../img/bukkyou_sottakudouji.png")} fluid />
          <h5>點擊圖徵選取活動資訊</h5>
        </Col>
      );
    } else {
      display = (
        <div>
          <h4>{this.props.selcetFeatureInfo[1]}</h4>
          <hr />
          <table>
            <tbody>
              <tr>
                <th className={styles.tabletitle}>活動地點:</th>
                <td>{this.props.selcetFeatureInfo[4]}</td>
              </tr>
              <tr>
                <th className={styles.tabletitle}>開始時間:</th>
                <td>{this.props.selcetFeatureInfo[2]}</td>
              </tr>
              <tr>
                <th className={styles.tabletitle}>結束時間:</th>
                <td>{this.props.selcetFeatureInfo[3]}</td>
              </tr>
            </tbody>
          </table>
          <hr />
          本活動獲得{this.props.selcetFeatureInfo[6]}個
          <button className={styles.likeplus} onClick={this.likeplus}>
            <i className="fa fa-heart" />
          </button>
          <hr />
          <div>{this.props.selcetFeatureInfo[5].split('&nbsp;')}</div>
        </div>
      );
    }

    return <Container style={{ paddingTop: "2vh" }}>{display}</Container>;
  }
}

const SlideInfo = connect(mapStateToProps,mapDispatchToProps)(ConnectedSlideInfo);
export default SlideInfo;
