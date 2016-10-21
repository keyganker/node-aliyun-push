import cryptoLib from 'crypto';

function popEscape(clearString) {
  clearString = clearString.toString();
  clearString = encodeURIComponent(clearString)
    .replace(/\!/gi, '%21')
    .replace(/\'/gi, '%27')
    .replace(/\(/gi, '%28')
    .replace(/\)/gi, '%29')
    .replace(/\*/gi, '%2A')
  return clearString;
}

function hmac(key, string, digest, fn) {
  if (!digest) {
    digest = 'binary';
  }
  if (digest === 'buffer') {
    digest = undefined;
  }
  if (!fn) {
    fn = 'sha256';
  }
  if (typeof string === 'string') {
    string = new Buffer(string);
  }

  return cryptoLib.createHmac(fn, key).update(string).digest(digest);
}

export function sign(method, params, accessKeySecret) {
  let canonicalizedQueryString = Object.keys(params).sort().map((value) => {
    return `${value}=${popEscape(params[value])}`;
  }).join('&');

  const stringToSign = `${method}&%2F&${popEscape(canonicalizedQueryString)}`;
  return hmac(accessKeySecret + '&', stringToSign, 'base64', 'sha1');
}
