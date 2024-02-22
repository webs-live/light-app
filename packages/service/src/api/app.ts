/**
 * ===============================================================
 * 
 * 轻应用与有手机端webviw通讯
 * 
 * ================================================================
 * /


/**
 * @description 退出当前轻应用
 * @param
 */
export function exitLightApp() {
  let obj = { type: 'exitLightApp' };
  (window as any)?.ReactNativeWebView?.postMessage(JSON.stringify(obj));
}

/**
 * @description 刷新当前webview
 * @param
 */
export function refreshLightApp() {
  window.location.reload();
}
