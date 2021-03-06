import request from 'request';
import moment from 'moment';
import TypedError from 'error/typed';
import _ from 'lodash';

import {sign, uniqId} from './util';

const ClientError = new TypedError({
  type: 'client',
  message: '{title}, statusCode={statusCode} statusMessage={statusMessage}',
  title: null,
  statusCode: null,
  statusMessage: null
});

const ERROR_NULL_RESPONSE = 601;
const ERROR_PARAMATERS = 602;
const ERROR_FAIL_RESPONSE = 603;

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
    if (typeof accessKeyId === 'undefined') {
      throw new ClientError({
        title: 'Call aliyun push error. ',
        statusCode: ERROR_PARAMATERS,
        statusMessage: 'param accessKeyId is undefined'
      });
    }
    if (typeof accessKeySecret === 'undefined') {
      throw new ClientError({
        title: 'Call aliyun push error. ',
        statusCode: ERROR_PARAMATERS,
        statusMessage: 'param accessKeySecret is undefined'
      });
    }
    if (typeof appKey === 'undefined') {
      throw new ClientError({
        title: 'Call aliyun push error. ',
        statusCode: ERROR_PARAMATERS,
        statusMessage: 'param appKey is undefined'
      });
    }

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
    content,
    payload,
    xiaomiActivity,
    expireTimeout = 3600 * 12
  }) {
    let params = {};
    _.assign(params, this._params);
    const timeStamp = `${moment((new Date()).getTime()).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`;
    const expireTime = `${moment((new Date()).getTime() + expireTimeout * 1000).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`;
    params = _.extend(params, {
      Action: 'Push',
      Target: target,
      TargetValue: targetValue,
      Type: type,
      DeviceType: deviceType,
      Title: title,
      Body: content,
      XiaomiActivity: xiaomiActivity,
      AndroidExtParameters: JSON.stringify(payload),
      StoreOffline: true,
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
          reject(_.extend(err, {
            data: {
              deviceTokens: targetValue,
              message: content
            }
          }));
          return;
        }
        if (!body) {
          reject(new ClientError({
            title: 'Call aliyun push error.',
            statusCode: message.statusCode,
            statusMessage: message.statusMessage,
            data: {
              deviceTokens: targetValue,
              message: content
            }
          }));
          return;
        }

        let data = JSON.parse(body);
        if (!data) {
          reject(new ClientError({
            title: 'Call aliyun push error.',
            statusCode: ERROR_NULL_RESPONSE,
            statusMessage: 'response body is null',
            data: {
              deviceTokens: targetValue,
              message: content
            }
          }));
        } else if (!data.ResponseId) {
            reject(new ClientError({
              title: 'Call aliyun push error.',
              statusCode: ERROR_FAIL_RESPONSE,
              statusMessage: data.Message,
              data: {
                deviceTokens: targetValue,
                message: content
              }
            }));
          }

        data = _.extend(data, {
          deviceTokens: targetValue,
          message: content,
          payload
        });
        resolve(data);
      });
    });
  }
}

export default AliYunPush;
