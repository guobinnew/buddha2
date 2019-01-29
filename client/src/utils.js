import yuchg from './base'
import logger from './logger'
import CryptoJS from 'crypto-js'
import $ from "jquery"

const localServer = true
function serverIp() {
  return localServer ? "http://localhost:3100" : "https://www.uorion.com"
}

const utils = {
  sha256: function(text) {
    return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
  },
  ajaxPost: function (option) {
    $.ajax({
      url: serverIp() + option.url,
      type: "POST",
      data: {data: JSON.stringify(option.data)},
      dataType: "json", //指定服务器返回的数据类型
      success: function(data) {
        option.success(data)
      }
    });
  },
  ajaxGet: function (option) {
    $.ajax({
      url: serverIp() + option.url,
      type: "GET",
      dataType: "json", //指定服务器返回的数据类型
      success: function(data) {
        option.success(data)
      }
    });
  }
}

export default utils
