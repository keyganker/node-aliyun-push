import AliPush from '../index';

const aliPush = new AliPush({
  baseUrl: 'http://cloudpush.aliyuncs.com',
  accessKeyId: 'xxx',
  accessKeySecret: 'xxx',
  signatureMethod: 'HMAC-SHA1',
  format: 'JSON',
  regionId: 'cn-hangzhou',
  signatureVersion: '1.0',
  version: '2015-08-27',
  appKey: 'xxx',
  proxy: 'xxx'
});

for (let i = 0; i < 2; i++) {
  aliPush.push({
    target: 'device',
    targetValue: 'xxx',
    type: 1,
    deviceType: 1,
    title: '财富派',
    content: '你有一个红包可领取!',
    payload: {id: 1, name: 'xuejian'}
  }).then((data) => {
    console.log(`Send aliyun push success. requestId[${data.RequestId}]
    responseId[${data.ResponseId}] deviceTokens[${data.deviceTokens}]
    message[${data.message}]`);
  }).catch((e) => {
    console.log(e);
  });
}
