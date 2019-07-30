import { IS_SLIDEWINDOW_SHOW,SLIDEWINDOW_TOGGLE,SHOW_FEATURE_INFO,USER_ID_UPDATA,TOKEN_UPDATA  } from "../constants/action-types";
const initialState = {
  isSlidewindowShow: 1,
  selcetFeatureInfo: null,
  userid: "",
  token: ""
};
function rootReducer(state = initialState, action) {

  if (action.type === IS_SLIDEWINDOW_SHOW && state.isSlidewindowShow === 0){
    // console.log("Slidewindow show(reducers)")
    return Object.assign({}, state, {isSlidewindowShow: 1});
  }

  if (action.type === SLIDEWINDOW_TOGGLE){
    // console.log("Slidewindow Toggle(reducers)")
    return Object.assign({}, state, {isSlidewindowShow: state.isSlidewindowShow===1?0:1});
  }

  if (action.type === SHOW_FEATURE_INFO){
    // console.log("SHOW FEATURE INFO(reducers)")
    return Object.assign({}, state, {selcetFeatureInfo: action.payload});
  }

  if (action.type === USER_ID_UPDATA){
    // console.log("USER_ID_UPDATA(reducers)")
    return Object.assign({}, state, {userid: action.payload});
  }

  if (action.type === TOKEN_UPDATA){
    // console.log("TOKEN_UPDATA(reducers)")
    return Object.assign({}, state, {token: action.payload});
  }

  return state;
}
export default rootReducer;