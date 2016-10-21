import {sign} from '../util';

const method = 'GET';
const params = {
  Format: 'XML',
  AccessKeyId: 'testid',
  Action: 'GetDeviceInfos',
  SignatureMethod: 'HMAC-SHA1',
  RegionId: 'cn-hangzhou',
  Devices: 'e2ba19de97604f55b165576736477b74,92a1da34bdfd4c9692714917ce22d53d',
  SignatureNonce: 'c4f5f0de-b3ff-4528-8a89-fa478bda8d80',
  SignatureVersion: '1.0',
  Version: '2015-08-27',
  AppKey: '23267207',
  Timestamp: '2016-03-29T03:59:24Z'
};
const accessKeySecret = 'testsecret';

console.log(sign(method, params, accessKeySecret));
