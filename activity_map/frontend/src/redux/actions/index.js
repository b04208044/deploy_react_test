import {
  IS_SLIDEWINDOW_SHOW,
  SLIDEWINDOW_TOGGLE,
  SHOW_FEATURE_INFO,
  USER_ID_UPDATA,
  TOKEN_UPDATA
} from "../constants/action-types";
export function slidewindowShow(payload) {
  return { type: IS_SLIDEWINDOW_SHOW, payload };
}

export function slidewindowToggle(payload) {
  return { type: SLIDEWINDOW_TOGGLE, payload };
}

export function showFeatureInfo(payload) {
  return { type: SHOW_FEATURE_INFO, payload };
}

export function userIDupdata(payload) {
  return { type: USER_ID_UPDATA, payload };
}

export function tokenUpdata(payload) {
  return { type: TOKEN_UPDATA, payload };
}
