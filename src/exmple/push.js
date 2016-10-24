import AliPush from '../index';

const aliPush = new AliPush({
  baseUrl: 'http://cloudpush.aliyuncs.com',
  accessKeyId: 'LTAIv4YM8TX617tc',
  accessKeySecret: 'bW0NGYa56iLvxgAwsxIOfwKA6WmhaI',
  signatureMethod: 'HMAC-SHA1',
  format: 'JSON',
  regionId: 'cn-hangzhou',
  signatureVersion: '1.0',
  version: '2015-08-27',
  appKey: '23478581',
  proxy: 'http://10.21.212.60:3128'
});

aliPush.push({
  target: 'device',
  targetValue: '6379df9d555d4edb90a21f1a00a042a4',
  type: 1,
  deviceType: 1,
  title: '财富派',
  message: '你有一个红包可领取!',
  payload: {id: 1, name: 'xuejian'}
}).then(() => {
  console.log('ok');
}).catch((e) => {
  console.log('error');
  console.log(e);
});
