import request from 'request';
import moment from 'moment';
import _ from 'lodash';

import {sign, uniqId} from './util';

class AliYunPush {
  constructor({
    baseUrl,
    accessKeyId,
    accessKeySecret,
    appKey,
    proxy,
    format = 'XML',
    timeout = 600,
    debug = false,
    logger = _.noop,
    regionId = 'cn-hangzhou',
    version = '2015-08-27',
    signatureMethod = 'HMAC-SHA1',
    signatureVersion = '1.0'
  }) {
    this._debug = debug;
    this._logger = logger;
    this._accessKeySecret = accessKeySecret;
    this._rs = request.defaults({
      baseUrl,
      proxy,
      timeout
    });

    this._params = {
      AccessKeyId: accessKeyId,
      AppKey: appKey,
      Format: format,
      Version: version,
      RegionId: regionId,
      SignatureMethod: signatureMethod,
      SignatureVersion: signatureVersion
    };
  }

  push({
    target,
    targetValue,
    type,
    deviceType,
    title,
    message,
    payload,
    expireTimeout = 3600*12
  }) {
    let params = this._params;
    const timeStamp = `${moment((new Date()).getTime()).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`;
    const expireTime = `${moment((new Date()).getTime()+expireTimeout * 1000).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`;
    params = _.extend(params, {
      Action: 'Push',
      Target: target,
      TargetValue: targetValue,
      Type: type,
      DeviceType: deviceType,
      Title: title,
      Body: message,
      AndroidExtParameters: JSON.stringify(payload),
      StoreOffLine: true,
      ExpireTime: expireTime,
      Timestamp: timeStamp,
      SignatureNonce: uniqId()
    });
    const signature = sign('POST', params, this._accessKeySecret);
    params = _.extend(params, {
      Signature: signature
    });

    return new Promise((resolve, reject) => {
      this._rs.post({
        uri: '/',
        form: params
      }, (err, message, body) => {
        if (err) {
          this._logger(`Call aliyun push failed. code[${err.code}] err[${err.message}]`);
          reject(err);
          return;
        }

        console.log(body);
        if (!body) {
        }
        resolve(body)
      });
    });
  }
}

export default AliYunPush;
