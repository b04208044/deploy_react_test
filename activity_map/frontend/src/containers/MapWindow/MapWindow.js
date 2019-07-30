import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlLayerVector from "ol/layer/Vector";
import OlSourceOSM from "ol/source/OSM";
import OlSourceXYZ from "ol/source/XYZ";
import OLSourceVector from "ol/source/Vector";
import OlFormatGeoJson from "ol/format/GeoJSON";
import OlStyleStyle from "ol/style/Style";
import OlStyleStroke from "ol/style/Stroke";
import OlStyleFill from "ol/style/Fill";
import OlStyleCircle from "ol/style/Circle";
import OlStyleIcon from "ol/style/Icon";
import OlSelect from "ol/interaction/Select.js";
import {
  fromLonLat as OlFromLonLat,
  get as OlGet,
  transformExtent as olTransformExtent
} from "ol/proj";

import styles from "./MapWindow.module.css";
import layerMetroline from "../../data_geo/metroline.geojson";
import featureIcon from "../../img/animalface_suzume2.png";
import featureIconS from "../../img/animalface_suzume3.png";

import { connect } from "react-redux";
import { showFeatureInfo } from "../../redux/actions/index";

import { GraphQLClient } from "graphql-request";
const dbURL = "http://localhost:8787/api";
const graphQLClient = new GraphQLClient(dbURL);
const geoJsonQuery = `
  query($page: Int, $limit: Int) {
    geoJSON(page: $page, limit: $limit)
  }
`;
const DataCountQuery = `
  query {
    totalGeoJson
  }
`;
const likesCountQuery = `
  query($postID: String!) {
    likesCount(postID: $postID)
  }
`

function mapDispatchToProps(dispatch) {
  return {
    showFeatureInfo: info => dispatch(showFeatureInfo(info))
  };
}
class ConnectedPublicMap extends Component {
  //ol預設投影:3857
  constructor(props) {
    super(props);

    this.state = { center: OlFromLonLat([120.5, 23.62]), zoom: 7 };

    //?   GEO JSON 測試用資料
    // this.testlayer = {
    //   type: "FeatureCollection",
    //   crs: {
    //     type: "name",
    //     properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    //   },
    //   features: [
    //     {
    //       type: "Feature",
    //       geometry: {
    //         type: "Point",
    //         coordinates: [121, 24]
    //       },
    //       properties: {
    //         _id: "5d19c49120df1c32c4ddcfa0",
    //         UID: "5d0a8886d083a335e0cb266e",
    //         title: "Bookstart閱讀起步走主題書展",
    //         category: "6",
    //         descriptionFilterHtml: "展出適合0-5歲幼童閱讀繪本.",
    //         time: "2019/07/02 08:30:00",
    //         endTime: "2019/07/31 17:30:00",
    //         location: "臺中市新社區社街四段1巷1號",
    //         locationName: "臺中市立圖書館新社分館",
    //         price: "",
    //         onSales: "N"
    //       }
    //     },
    //     {
    //       type: "Feature",
    //       geometry: {
    //         type: "Point",
    //         coordinates: [121.637283, 24.637283]
    //       },
    //       properties: {
    //         _id: "5d19c49120df1c32c4ddcfa1",
    //         UID: "5d0a888ed083a335e0cb2672",
    //         title: "林金昌雕刻創作展／曹天韻水墨畫創作展",
    //         category: "6",
    //         descriptionFilterHtml: "歡迎民眾參觀。",
    //         time: "2019/07/01 08:30:00",
    //         endTime: "2019/09/30 17:00:00",
    //         location: "臺中市西屯區臺灣大道三段99號",
    //         locationName: "臺中市政府新市政大樓",
    //         price: "",
    //         onSales: "N"
    //       }
    //     }
    //   ]
    // };

    this.styles = {
      metroline: [
        new OlStyleStyle({
          stroke: new OlStyleStroke({
            color: "rgba(100, 100, 255, 0.9)",
            width: 4,
            lineDash: [4, 8] //line dash pattern [line, space]
          })
        })
      ],
      act: new OlStyleStyle({
        image: new OlStyleCircle({
          radius: 7,
          fill: new OlStyleFill({
            color: "#ff0000"
          }),
          stroke: new OlStyleStroke({
            color: "rgba(255, 255, 255, 0.5)",
            width: 2
          })
        })
      })
    };

    this.layers = {
      //底圖
      OSM: {
        //OSM物件
        title: "OpenStreetMap(開放街圖)", //名字會顯示
        type: "base",
        layer: new OlLayerTile({
          visible: false,
          source: new OlSourceOSM() //OSM提供的公式
        })
      },
      GoogleMapsS: {
        title: "Google Maps S",
        type: "base",
        layer: new OlLayerTile({
          visible: false,
          source: new OlSourceXYZ({
            crossOrigin: "anonymous",
            url: "https://mt{0-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" //估狗規定的網址，lyrs=m可以改變成不同圖層(分開寫就是多個底圖!)
          })
        })
      },
      GoogleMaps: {
        title: "Google Maps",
        type: "base",
        layer: new OlLayerTile({
          visible: false,
          source: new OlSourceXYZ({
            crossOrigin: "anonymous",
            url: "https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" //估狗規定的網址，lyrs=m可以改變成不同圖層(分開寫就是多個底圖!)
          })
        })
      },
      metroline: {
        title: "捷運線",
        type: "overlay",
        layer: new OlLayerVector({
          visible: true,
          source: new OLSourceVector({
            format: new OlFormatGeoJson(),
            url: layerMetroline
          })
        })
      }
    };

    this.olmap = new OlMap({
      target: null,
      layers: Object.keys(this.layers).map(e => this.layers[e].layer),
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom,
        maxZoom: 18,
        minZoom: 7,
        extent: olTransformExtent(
          [117, 21, 124, 25.3],
          "EPSG:4326",
          "EPSG:3857"
        )
      })
    });
  }

  setLayer(key) {
    //切換底圖層顯示
    //按鈕style切換
    for (let i = 0; i < Object.keys(this.layers).length; i++) {
      var tlayer = this.layers[Object.keys(this.layers)[i]];
      if (tlayer.type === "base") {
        this.layers[Object.keys(this.layers)[i]].layer.setVisible(
          Object.keys(this.layers)[i] === key
        );
        let baseBtn = document.getElementById(
          Object.keys(this.layers)[i] + "Btn"
        ).classList;
        if (Object.keys(this.layers)[i] === key) {
          baseBtn.add(styles.BtnFocus);
        } else {
          baseBtn.remove(styles.BtnFocus);
        }
      }
    }
  }

  setOverLayer(key) {
    //切換圖層顯示
    let btnstyle = document.getElementById(key + "Btn");
    if (btnstyle.className === styles.BtnFocus) {
      this.layers[key].layer.setVisible(false);
      btnstyle.classList.remove(styles.BtnFocus);
      btnstyle.classList.add(styles.Btn);
    } else {
      this.layers[key].layer.setVisible(true);
      btnstyle.classList.remove(styles.Btn);
      btnstyle.classList.add(styles.BtnFocus);
    }
  }

  initLayers() {
    //上圖層STYLE
    for (let i = 0; i < Object.keys(this.layers).length; i++) {
      var tlayer = this.layers[Object.keys(this.layers)[i]];
      if (tlayer.type === "overlay") {
        tlayer.layer.setZIndex(100 - i);
        tlayer.layer.setStyle(this.styles[Object.keys(this.layers)[i]]);
      }
    }
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  focus2taipei() {
    this.setState({ center: [13530000, 2883000], zoom: 11.5 });
  }

  loadJsonSource2layer(geojson) {
    var source = new OLSourceVector({});
    var options = {};
    if (
      typeof geojson.crs != "undefined" &&
      typeof geojson.crs.properties != "undefined" &&
      typeof geojson.crs.properties.name != "undefined"
    ) {
      options = {
        dataProjection: OlGet(geojson.crs.properties.name), //'EPSG:3826','EPSG:4326'
        featureProjection: OlGet("EPSG:3857")
      };
    }
    var features = new OlFormatGeoJson().readFeatures(geojson, options);
    source.addFeatures(features);

    return source;
  }

  fetchGeoData = async () => {
    let dataCount = (await graphQLClient.request(DataCountQuery))[
      "totalGeoJson"
    ];
    let page = 1;
    const limit = 100;
    while (dataCount > 0) {
      const rawData = (await graphQLClient.request(geoJsonQuery, {
        page: page,
        limit: limit
      }))["geoJSON"];
      const data = JSON.parse(rawData);
      data.crs = {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
      };
      this.olmap.addLayer(
        new OlLayerVector({
          source: this.loadJsonSource2layer(data), //獲取資料放這裡
          zIndex: 100,
          style: new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 0.5],
              opacity: 1.0,
              crossOrigin: "anonymous",
              src: featureIcon,
              scale: 0.1
            })
          })
        })
      );
      dataCount -= limit;
      page += 1;
    }
  };

  componentDidMount() {
    this.props.showFeatureInfo(null)
    this.initLayers();
    this.setLayer("OSM");
    this.olmap.setTarget("map");

    this.fetchGeoData();

    // Listen to map changes
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });

    var select = new OlSelect();
    this.olmap.addInteraction(select);
    const showFeatureInfo = this.props.showFeatureInfo;
    const historyPush =  this.props.history.push;
    select.on("select", function(e) {
      var selected = e.selected; //選取圖徵style
      var deselected = e.deselected;
      selected.forEach(function(feature) {
        feature.setStyle(
          new OlStyleStyle({
            image: new OlStyleIcon({
              anchor: [0.5, 0.5],
              opacity: 1.0,
              crossOrigin: "anonymous",
              src: featureIconS,
              scale: 0.1
            })
          })
        );
      });
      deselected.forEach(function(feature) {
        feature.setStyle(null);
      });

      if (
        e.selected[0] !== undefined &&
        e.selected[0].values_.geometry.getType() === "Point"
      ) {
        // console.log(e.target.getFeatures())
        // console.log(e.selected[0].values_);
        const asyncShowFeatureInfo = async () => {
          const {
            _id,
            title,
            time,
            endTime,
            locationName,
            descriptionFilterHtml
          } = e.selected[0].values_;

          const client = new GraphQLClient(dbURL)
          const count = await client.request(likesCountQuery, {postID: _id})
          showFeatureInfo([
            _id,
            title,
            time,
            endTime,
            locationName,
            descriptionFilterHtml,
            count.likesCount
          ]);
          historyPush("/info");
        }
        asyncShowFeatureInfo();

      }else{
        showFeatureInfo(null)
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  render() {
    this.updateMap(); // Update map on render?
    return (
      <div id="map" style={{ width: "100%", height: "100%" }}>
        <div className={styles.float}>
          <button onClick={e => this.focus2taipei()} className={styles.Btn}>
            Focus to Taipei
          </button>
          &nbsp;
          <button
            onClick={e => this.setLayer("OSM")}
            className={styles.Btn}
            id="OSMBtn"
            style={{ borderRadius: "4px 0 0 4px" }}
          >
            OSM街道圖
          </button>
          <button
            onClick={e => this.setLayer("GoogleMaps")}
            className={styles.Btn}
            id="GoogleMapsBtn"
            style={{ borderRadius: "0 0px 0px 0" }}
          >
            Google街道圖
          </button>
          <button
            onClick={e => this.setLayer("GoogleMapsS")}
            className={styles.Btn}
            id="GoogleMapsSBtn"
            style={{ borderRadius: "0 4px 4px 0" }}
          >
            Google衛星影像
          </button>
          &nbsp;
          <button
            onClick={() => this.setOverLayer("metroline")}
            className={styles.BtnFocus}
            id="metrolineBtn"
          >
            台北捷運
          </button>
        </div>
      </div>
    );
  }
}

const PublicMap = connect(
  null,
  mapDispatchToProps
)(ConnectedPublicMap); //
export default withRouter(PublicMap);
