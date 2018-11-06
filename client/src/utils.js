import yuchg from './base'
import logger from './logger'
import CryptoJS from 'crypto-js'
import $ from "jquery";

const cryptoSecret = "unique@buddha2"
const serverIp = "http://localhost:3000" //"http://www.uorion.com:3000"
const utils = {
  sha256: function(text) {
    return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
  },
  encodeJson: function(json) {
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(json),
      cryptoSecret
    );
    return ciphertext.toString();
  },
  decodeJson: function(code) {
    let bytes  = CryptoJS.AES.decrypt(code, cryptoSecret);
    let str =  bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(str)
  },
  ajaxPost: function (option) {
    $.ajax({
      url: serverIp + option.url,
      type: "POST",
      data: {data: utils.encodeJson(option.data)},
      dataType: "text", //指定服务器返回的数据类型
      success: function(data) {
        let json = utils.decodeJson(data)
        option.success(json)
      }
    });
  },
  ajaxGet: function (option) {
    $.ajax({
      url: serverIp + option.url,
      type: "GET",
      dataType: "text", //指定服务器返回的数据类型
      success: function(data) {
        let json = utils.decodeJson(data)
        option.success(json)
      }
    });
  }
}

export default utils
