---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript
  - php
  - python
  

toc_footers:
  - <a href='javascript:getApiKey()'>Issue API Key</a>
  - <a href='javascript:apiGitHome()'>Github</a>



lang_change: true

exchange: true

search: false
---

# Guide

Welcome to the GOPAX API!

The following documents are shared to enable you to use some of the features of GOPAX through the REST API.

## API Endpoint (URL)

GOPAX REST API menyediakan endpoints untuk manajemen akun/pemesanan dan data pasar publik.

<code id="apiUrl" >https://api.gopax.co.id</code>

## API Call Rate Limit

Ketika batas pemanggilan API terlampaui, status kode 429 - Too Many Requests akan dikembalikan.

## Request/Response Format

Content-type untuk semua request dan response adalah application/json, dan mengikuti standar status kode response HTTP. Sebagai contoh, permintaan berhasil akan mengembalikan status kode 200.

# Private API Authentication

Untuk proses autentikasi private API, REST request harus berisi HTTP header di bawah ini.

1. API-KEY:theissuedAPIkey
2. SIGNATURE: the message signature value (penjelasan detail di bawah)
3. NONCE:aconstantlyincreasingnon-redundantvalue(typically,timestamp)

<aside class="warning">
Jika nilai NONCE yang sama digunakan, maka server akan menolak request tersebut.
</aside>

<aside class="notice">
Content-type HTTP body harus application/json.
</aside>

## SIGNATURE digenerate berdasarkan prosedur berikut.

> Example :

```javascript
const crypto = require('crypto');

const generateSignature = (secret, nonce, method, path, body = null) => {
  const requestPath = path.split('?')[0];
  const _body = body ? JSON.stringify(body) : '';

  const what = `${nonce}${method}${requestPath}${_body}`;
  const key = Buffer(secret, 'base64');
  const hmac = crypto.createHmac('sha512', key);
  return hmac.update(what).digest('base64');
};
```

```php
<?
function generateSignature($secret, $nonce, $method, $path, $body = null)
{
  $_body = $body ? json_encode($body) : '';
  $tokenizedPath = explode('?', $path);
  $requestPath   = $tokenizedPath[0];
  $what          = $nonce . $method . $requestPath . $_body;
  $secret        = base64_decode($secret);
  return base64_encode(hash_hmac('sha512', $what, $secret, true));
}
```

```python
import time, base64, hmac, hashlib

nonce = str(time.time())
method = 'GET'
request_path = '/balances'

what = nonce + method + request_path # + request_body
key = base64.b64decode(secret)
signature = hmac.new(key, what, hashlib.sha512)
return base64.b64encode(signature.digest())
```

1. Lakukan proses string-concatenation dengan urutan di bawah ini.
2. Decodeissuedsecretdenganbase64
3. Gunakan hasil dari nomor 2 sebagai secret key untuk sha512 HMAC
4. Encode value dari nomor 3 dengan base64

<aside class="warning">
Kunci Rahasia dihasilkan ketika kunci API dikeluarkan. Jika Kunci Rahasia hilang, Anda harus menerbitkan kembali <a href="javascript:getApiKey()">Kunci API</a>.
</aside>

## HTTP header example

<code class="block" >
API-KEY: 128f0123-2a5d-48f5-8f19-e937f38f0a99
SIGNATURE: gn2poOBVCAd5GLqXFAZGK9Pk4VD7+OaNtDIkFjejwIBjBm1X/DYPZVAP1rex6XqwH8vHt36ap26lTN85HVJz2g==
NONCE: 1520994527165
Content-Type: application/json
</code>

<aside class="warning">
The above example cannot be used for testing. Create it through <a href="javascript:getApiKey()">personal API Key</a>
</aside>

# Authenticated Calls

## Get balances

> Response : 

```json
[
  {
    "asset": "IDR",
    "avail": 9101080.53,
    "hold": 0,
    "pendingWithdrawal": 0
  }, {
    "asset": "ETH",
    "avail": 0,
    "hold": 0,
    "pendingWithdrawal": 0
  }, {
    "asset": "BTC",
    "avail": 0.42317058,
    "hold": 0,
    "pendingWithdrawal": 0
  }, {
    "asset": "BCH",
    "avail": 0,
    "hold": 0,
    "pendingWithdrawal": 0
  }
]
```
### HTTP request
`GET /balances`

### Description of Response

<code class="block" >
{
  "asset": <i style="color: black;">[Asset Name]</i>,
  "avail": <i style="color: black;">[Avail]</i>,
  "hold": <i style="color: black;">[Hold]</i>,
  "pendingWithdrawal": <i style="color: black;">[Pending Withdrawal]</i>
}
</code>


| Value | Description |
| --- | --- |
| Asset Name | Asset Name. You can view the entire list in the [Asset List Query](#get-assets) |
| Avail | Transactionable Amount (Quantity) |
| Hold | Outstanding Amount(Quantity) |
| Pending Withdrawal | Amount in Withdrawal(Quantity) |

## Get balance by asset name

> Response : 

```json
{
  "asset": "IDR",
  "avail": 9101080.53,
  "hold": 0,
  "pendingWithdrawal": 0
}
```
### HTTP request
`GET /balances/<Asset Name>`
### URL parameter

| parameter | Description |
| --- | --- |
| Asset Name | Asset Name. You can view the entire list in the [Asset List Query](#get-assets) |

### Description of Response

<code class="block" >
{
  "asset": <i style="color: black;">[Asset Name]</i>,
  "avail": <i style="color: black;">[Avail]</i>,
  "hold": <i style="color: black;">[Hold]</i>,
  "pendingWithdrawal": <i style="color: black;">[Pending Withdrawal]</i>
}
</code>

| 값 | Description |
| --- | --- |
| Asset Name | Asset Name. You can view the entire list in the [Asset List Query] |
| Avail | Transactionable Amount (Quantity) |
| Hold | Outstanding Amount(Quantity) |
| Pending Withdrawal | Amount in Withdrawal(Quantity) |

## Get orders

> Response : 

```json
[
  {
    "id": "23712",
    "price": 101,
    "amount": 100,
    "tradingPairName": "CND-IDR",
    "side": "sell",
    "type": "limit",
    "createdAt": "2018-01-08T12:44:03.000Z"
  }, {
    "id": "23916",
    "price": 90,
    "amount": 30,
    "tradingPairName": "CND-IDR",
    "side": "buy",
    "type": "limit",
    "createdAt": "2018-01-09T10:43:10.000Z"
  }
]
```
### HTTP request
`GET /orders`

### Description of Response
<code class="block">
{
  "id": <i style="color: black;">[ID]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "tradingPairName": <i style="color: black;">[Trading Pair]</i>,
  "side": <i style="color: black;">[Side]</i>,
  "type": <i style="color: black;">[Type]</i>,
  "createdAt": <i style="color: black;">[Created At]</i>
}
</code>

| Value | Description |
| --- | --- |
| ID	| Unique No. of order |
| Price | Order price |
| Amount | Order amount |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |
| Side | Trading Type (`buy`, `sell`) |
| Type | Order Type (`limit`, `market`) |
| Created At | Order Time |

<aside class="notice">
Terdapat dua jenis order, limit dan market. Order hanya dapat dilakukan jika terdapat saldo yang cukup pada akun. Sekali order dilakukan, saldo tersebut ditunda selama durasi pemesanan. Jenis dan jumlah aset yang ditahan ditentukan oleh jenis pemesanan dan parameter yang ditentukan.
</aside>

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

## Get order by order ID

> Response : 

```json
{
  "id": "23712",
  "status": "placed",
  "side": "sell",
  "type": "limit",
  "price": 101,
  "amount": 100,
  "remaining": 100,
  "tradingPairName": "CND-IDR",
  "createdAt": "2018-01-08T12:44:03.000Z"
}
```
### HTTP request

`GET /orders/<Order Id>`

### Description of Response

<code class="block">
{
  "id": <i style="color: black;">[ID]</i>,
  "status": <i style="color: black;">[Status]</i>,
  "side": <i style="color: black;">[Side]</i>,
  "type": <i style="color: black;">[Type]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "remaining": <i style="color: black;">[Remaining]</i>,
  "tradingPairName": <i style="color: black;">[Trading Pair]</i>,
  "createdAt": <i style="color: black;">[Created At]</i>
}
</code>

| Value | Description |
| --- | --- |
| ID	| Unique No. of order |
| Status | 상태 placed: 주문됨, cancelled: 취소됨, completed: 체결됨, updated: 부분 체결됨 |
| Side | Trading Type (`buy` , `sell`) |
| Type | Order Type (`limit`, `market`) |
| Price | Order Price |
| Amount | Order Amount |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |
| Created At | Order Time |

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

## Place order

> Example :

```python
import time, base64, hmac, hashlib, requests, json

apikey = ''
secret = ''
nonce = str(time.time())
method = 'POST'
request_path = '/orders'

request_body = 
# Example of buying ETH-IDR by limit order
{
    "type": "limit",
    "side": "buy",
    "price": 1000000,
    "amount": 10,
    "tradingPairName": "ETH-IDR"
}
# Example of selling ETH-IDR by market order
{
      "type": "market",
      "side": "sell",
      "amount": 10,
      "tradingPairName": "ETH-IDR"
}
# Example of buying ETH-IDR by market order
{
    "type": "market",
    "side": "buy",
    "amount": 1000000,
    "tradingPairName": "ETH-IDR"
}

what = nonce + method + request_path + json.dumps(request_body,sort_keys=True)
key = base64.b64decode(secret)
signature = hmac.new(key, str(what).encode('utf-8'), hashlib.sha512)
signature_b64 = base64.b64encode(signature.digest())

custom_headers = {
	'API-Key': apikey,
	'Signature': signature_b64,
	'Nonce': nonce
}
								
def main():
	req = requests.post(url = 'API Endpoint URL' + request_path, headers = custom_headers,json=request_body)

	if req.ok:
		print(req.text)

	else:
		print ('요청 에러')
		print(req.text)
 
if __name__ == '__main__':
	main()
```
```javascript
var crypto = require('crypto');
var request = require('request');

var apikey = '';
var secret = '';
var nonce = Date.now() * 1000;
var method = 'POST';
var requestPath = '/orders';
var json_body = 
// Example of buying ETH-IDR by limit order 
{
    type: "limit",
    side: "buy",
    price: 1000000,
    amount: 10,
    tradingPairName: "ETH-IDR"
};
// Example of selling ETH-IDR by market order
{
    type: "market",
    side: "sell",
    amount: 10,
    tradingPairName: "ETH-IDR"
};
// Example of buying ETH-IDR by market order
{
    type: "market",
    side: "buy",
    amount: 1000000,
    tradingPairName: "ETH-IDR"
};

var body = JSON.stringify(json_body, Object.keys(json_body).sort());
var what = nonce + method + requestPath + body;
var key = Buffer(secret, 'base64');
var hmac = crypto.createHmac('sha512', key);
var sign = hmac.update(what).digest('base64');

var host = 'API Endpoint URL without protocol';

var options = {
  method,
  body: json_body,
  json: true,
  url: `https://${host}${requestPath}`,
  headers: {
    'API-KEY': apikey,
    Signature: sign,
    Nonce: nonce
  },
  strictSSL: false,
};

request(options, (err, response, b) => {
  if (err) {
    console.log('err:', err);
    return;
  }
  console.log(b);
});
```

```php
<?
private apiKey = '';
private apiSecret = '';

const API_HOST = 'API Endpoint URL';
const VERSION = 'gopax-php-sdk-20171216';

private function request(string $method, string $path, $request = NULL)
{
    $curl = curl_init();

    $mt = explode(' ', microtime());
    $nonce     = $mt[1] . substr($mt[0], 2, 6);
    $method    = strtoupper($method);

    $tokenizedPath = explode('?', $path);
    $requestPath   = $tokenizedPath[0];
    $what          = $nonce . $method . $requestPath . $request;
    $secret        = base64_decode($this->apiSecret);
    $signature     = base64_encode(hash_hmac('sha512', $what, $secret, true));
    
    $headers[] = 'Content-Type: application/json';
    $headers[] = 'API-KEY: ' . $this->apiKey;
    $headers[] = 'SIGNATURE: ' . $signature;
    $headers[] = 'NONCE: ' . $nonce;
    curl_setopt($curl, CURLOPT_USERAGENT, self::VERSION);
    curl_setopt($curl, CURLOPT_URL, self::API_HOST . $path);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POST, TRUE);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $postData);
    
    $json       = curl_exec($curl);
    $httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    return new Response($httpStatus, $json);
}

public function setParameter(string $type, string $side, float $price, float $amountPlace or, string $tradingPairName)
{
    $data['type']            = $type; // LIMIT, MARKET
    $data['side']            = $side; // BUY, SELL
    $data['price']           = $price;
    $data['amount']          = $amount;
    $data['tradingPairName'] = $tradingPairName;
    return json_encode($data);
}

$orderRequest = setParameter(
  //Example of buying ETH-IDR by limit order
   'limit', 'buy', 10000000, 0.1, 'ETH-IDR'
 );
 (
   // Example of selling ETH-IDR by market order
   'market', 'sell', 0, 10, 'ETH-IDR'
 );
 (
   // Example of buying ETH-IDR by market order
   'market', 'buy', 0, 1000000,'ETH-IDR'
 );

print_r($this->request('POST','/orders',$orderRequest));
    
```


### HTTP request
`POST /orders`

### Description of request Body

<code class="block" >
{
  "type": <i style="color: black;">[Type]</i>,
  "side": <i style="color: black;">[Side]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "tradingPairName": <i style="color: black;">[Trading Pair]</i>
}
</code>

| 값 | Description |
| --- | --- |
| Type | Order Type (`limit`, `market`) |
| Side | Trading Type (`buy`, `sell`) |
| Price | Order Price |
| Amount | Order Amount |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |


### Description of Response
> Response : 

```json
{
  "id": "98723",
  "price": 750000,
  "amount": 9,
  "tradingPairName": "ETH-IDR",
  "side": "buy",
  "type": "limit",
  "createdAt": "2018-01-09T10:43:10.000Z"
}
```
<code class="block" style="white-space: pre; ">
{
  "id": <i style="color: black;">[ID]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "tradingPairName": <i style="color: black;">[Trading Pair]</i>,
  "side": <i style="color: black;">[Side]</i>,
  "type": <i style="color: black;">[Type[]</i>,
  "createdAt": <i style="color: black;">[Created At]</i>
}
</code>

| 값 | Description |
| --- | --- |
| ID	| Unique No. of order |
| Price | Order Price |
| Amount | Order Amount |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |
| Side | Trading Type (`buy`, `sell`) |
| Type | Order Type (`limit`, `market`) |
| Created At | Order Time |

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

<aside class="warning">
Silakan periksa <a href="#api-endpoint-url">API Endpoint URL</a>.
</aside>

## Cancel order by order ID

> Response : 

```json
{
}
```
### HTTP request
`DELETE /orders/<Order Id>`

### URL parameter

| Parameter | Description |
| --- | --- |
| Order Id	| Unique No. of order |

## Get the user's trade history

> Response : 

```json
[
  {
    "id": 23152,
    "orderId": 23712,
    "baseAmount": 0.00968007,
    "quoteAmount": 99999.963135,
    "fee": 0,
    "price": 10330500,
    "timestamp": "2018-03-10T16:07:32.000Z",
    "side": "buy",
    "tradingPairName": "BTC-IDR"
  }, {
    "id": 23302,
    "orderId": 23916,
    "baseAmount": 0.00149051,
    "quoteAmount": 15399.94932,
    "fee": 0,
    "price": 10332000,
    "timestamp": "2018-03-10T16:03:54.000Z",
    "side": "buy",
    "tradingPairName": "BTC-IDR"
  }
]
```
### HTTP request
`GET /trades?limit=[limit]&pastmax=[pastmax]&latestmin=[latestmin]&after=[after]&before=[before]`

### Query String Parameter

| parameter | Mandatory | Description |
| --- | --- | --- |
| limit | Option | Number of items returned (up to 100) |
| pastmax | Option | Excludes data older than this ID |
| latestmin | Option | Load new and newer data than this ID |
| after | Option | Excluding data after this timestamp (in ms) |
| before | Option | Excluding data before this timestamp (in ms) |

### Description of Response

<code class="block">
{
  "id": <i style="color: black;">[ID]</i>,
  "orderId": <i style="color: black;">[Order ID]</i>,
  "baseAmount": <i style="color: black;">[Base Amount]</i>,
  "quoteAmount": <i style="color: black;">[Quote Amount]</i>,
  "fee": <i style="color: black;">[Fee]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "timestamp": <i style="color: black;">[Timestamp]</i>,
  "side": <i style="color: black;">[Side]</i>,
  "tradingPairName": <i style="color: black;">[Trading Pair]</i>
}
</code>

| 값 | Description |
| --- | --- |
| ID | Unique No. of trade |
| Order ID | Unique No. of order |
| Base Amount | Trading quantity (Include Fee on purchase) |
| Quote Amount | Trading quantity * Order Price (Include Fee on sale) |
| Fee | Trading fee |
| Price | Order Price |
| Timestamp | Time to close a deal |
| Side | Trading Type (`buy`, `sell`) |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

# Unauthenticated Calls

## Get assets
> Response :

```json
[
  {
    "id": "IDR",
    "name": "Rupiah"
  }, {
    "id": "ETH",
    "name": "Ethereum"
  }, {
    "id": "BTC",
    "name": "Bitcoin"
  }
]
```
You can view a list of all assets handled by GOPAX.


### HTTP request
`GET /assets`

## Get trading pairs
> Response :

```json
[
  {
    "name": "ETH-IDR",
    "baseAsset": "ETH",
    "quoteAsset": "IDR"
  }, {
    "name": "BTC-IDR",
    "baseAsset": "BTC",
    "quoteAsset": "IDR"
  }, {
    "name": "BCH-IDR",
    "baseAsset": "BCH",
    "quoteAsset": "IDR"
  }
]
```
### HTTP request
`GET /trading-pairs`

## Get ticker by trading pair
> Response :

```json
{
  "price": 10194500,
  "ask": 10195000,
  "bid": 10184500,
  "volume": 1752.05558316,
  "time": "2018-03-14T03:50:41.184Z"
}
```

### HTTP request
`GET /trading-pairs/<Trading Pair>/ticker`

### URL parameter
| parameter | Description |
| --- | --- |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list](#get-trading-pairs) query. |

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

## Get order book by trading pair

### HTTP request
`GET /trading-pairs/<Trading Pair>/book`

### URL parameter
| parameter | Description |
| --- | --- |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list](#get-trading-pairs) query. |

### Query String Parameter
| parameter | Mandatory | Description |
| --- | --- | --- |
| level | Option | set the detail level of the order book (1 = best bid & ask, 2 = 50 bids & asks, other = all) |

## Get recent trades

### HTTP request
`GET /trading-pairs/<Trading Pair>/trades?limit=[limit]&pastmax=[pastmax]&latestmin=[latestmin]&after=[after]&before=[before]`

### URL parameter
| parameter | Description |
| --- | --- |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list](#get-trading-pairs) query. |

### Query String Parameter
| parameter | Mandatory | Description |
| --- | --- | --- |
| limit | Option | Number of items returned (up to 100) |
| pastmax | Option | Excludes data older than this ID |
| latestmin | Option | Load new and newer data than this ID |
| after | Option | Excluding data after this timestamp (in ms) |
| before | Option | Excluding data before this timestamp (in ms)  |

### Description of Response

> Response :

```json
[
  {
    "time": "2018-03-14T04:01:17.000Z",
    "date": 1521000077,
    "id": 6436174,
    "price": 10163000,
    "amount": 0.38115097,
    "side": "sell"
  }, {
    "time": "2018-03-14T04:01:17.000Z",
    "date": 1521000077,
    "id": 6436173,
    "price": 10164500,
    "amount": 0.12818829,
    "side": "sell"
  }, {
    "time": "2018-03-14T04:01:11.000Z",
    "date": 1521000071,
    "id": 6436171,
    "price": 10163000,
    "amount": 0.098,
    "side": "sell"
  }
]
```
### Description of Response

<code class="block">
{
  "time": <i style="color: black;">[Time]</i>,
  "id": <i style="color: black;">[ID]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "side": <i style="color: black;">[Side]</i>
}Korean Won
</code>

| Value | Description |
| --- | --- |
| Time | Trading Time |
| ID | Unique No. of Trade |
| Price | Trading Price |
| Amount | Trading Amount |
| Side | Trading Type (`buy`, `sell`) |

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

## Get 24hr stats by trading pair

> Response :

```json
{
  "open": 10297000,
  "high": 10362500,
  "low": 9901000,
  "close": 10089500,
  "volume": 1700.84866009,
  "time": "2018-03-14T05:02:37.337Z"
}
```

### HTTP request
`GET /trading-pairs/<Trading Pair>/stats`

### Description of Response

<code class="block">
{
  "open": <i style="color: black;">[Open]</i>,
  "high": <i style="color: black;">[High]</i>,
  "low": <i style="color: black;">[Low]</i>,
  "close": <i style="color: black;">[Close]</i>,
  "volume": <i style="color: black;">[Volume]</i>,
  "time": <i style="color: black;">[Time]</i>
}
</code>

| Value | Description |
| --- | --- |
| Open | Price 24hrs ago |
| High | 24-hour peak price |
| Low | 24-hour low |
| Close | Current price (Renew every minute) |
| Volume | 24-hour trading volume |
| Time | Latest data renewal time |

<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

## Get historic rates by trading pair

> Response :

```json
[
  [
    1521004020000,
    10081000,
    10081000,
    10081000,
    10081000,
    0.0398393
  ],
  [
    1521004080000,
    10081000,
    10081000,
    10081000,
    10081000,
    0.01
  ]
]
```
### HTTP request
`GET /trading-pairs/<Trading Pair>/candles?start=<Start>&end=<End>&interval=<Interval>`

### URL parameter
| parameter | Description |
| --- | --- |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list](#get-trading-pairs) query. |

### Query String Parameter
| parameter | Mandatory | Description |
| --- | --- | --- |
| Start | Yes | Start Timestamp (in ms) |
| End | Yes | End Timestamp (in ms) |
| Interval | Yes | Prefer Interval (in Minute, 1/5/30/1440) |

### Description of Response

<code class="block">
[
  [
    <i style="color: black;">[Time]</i>,
    <i style="color: black;">[Low]</i>,
    <i style="color: black;">[High]</i>,
    <i style="color: black;">[Open]</i>,
    <i style="color: black;">[Close]</i>,
    <i style="color: black;">[Volume]</i>
  ],
  [
    1521004080000,
    10081000,
    10081000,
    10081000,
    10081000,
    0.01
  ]
]
</code>

| 값 | Description |
| --- | --- |
| Time | Latest data renewal time |
| Low | 24-hour low |
| High | 24-hour peak price |
| Open | Price 24hrs ago |
| Close | Current price (Renew every minute) |
| Volume | 24-hour trading volume |

## Get 24hr stats for all trading pairs

> Response :

```json
[
  {
    "name": "ETH-IDR",
    "open": 780000,
    "high": 784000,
    "low": 756000,
    "close": 763500,
    "volume": 1602.93236136,
    "time": "2018-03-14T05:13:08.364Z"
  }, {
    "name": "BTC-IDR",
    "open": 10308000,
    "high": 10362500,
    "low": 9901000,
    "close": 10074000,
    "volume": 1687.88476801,
    "time": "2018-03-14T05:12:08.245Z"
  }, {
    "name": "BCH-IDR",
    "open": 1234000,
    "high": 1234000,
    "low": 1120000,
    "close": 1149500,
    "volume": 35.12077207,
    "time": "2018-03-14T04:40:06.535Z"
  }
]
```

### HTTP request
`GET /trading-pairs/stats`

### Description of Response

<code class="block">
  {
  "name": <i style="color: black;">[Trading Pair]</i>,
  "open": <i style="color: black;">[Open]</i>,
  "high": <i style="color: black;">[High]</i>,
  "low": <i style="color: black;">[Low]</i>,
  "close": <i style="color: black;">[Close]</i>,
  "volume": <i style="color: black;">[Volume]</i>,
  "time": <i style="color: black;">[Time]</i>
}
</code>

| 값 | Description |
| --- | --- |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |
| Open | Price 24hrs ago |
| High | 24-hour peak price |
| Low | 24-hour low |
| Close | Current price (Renew every minute) |
| Volume | 24-hour trading volume |
| Time | Latest data renewal time |


<aside class="notice">
Semua API timestamp mengembalikan dalam microsecond mengikuti standar format ISO 8601. Hampir semua bahasa pemrograman dan framework modern mendukung format ini.
</aside>

# Errors

## HTTP Status (Response code)
| Error Code | Description |
| :---: | --- |
| 400 | Bad request - Invalid request format |
| 401 | Unauthorized - Invalid API Key |
| 403 | Forbidden - No access to the requested resource |
| 404 | Not found |
| 429 | Too many requests - API call rate limit is exceeded |
| 500 | Internal Server Error – Problem with the server |

## GOPAX Error

| Error Code | Description |
| :---: | --- |
| 100, 106 | Invalid Asset Name. You can view the entire list in the [Asset List Query] |
| 103 | Invalid Order Type |
| 101, 104 | Invalid Trading Pair. You can check the entire list in the [trading pair list](#get-trading-pairs) query. |
| 105 | Inactived Trading Pair temporarily. You can check the entire list in the [trading pair list](#get-trading-pairs) query. |
| 107 | Invalid Order Amount |
| 108 | Invalid Order Price |
| 201 | Insufficient balance for the order |
| 202 | Unmached unique No. of Order |
| 203 | Too much value (Order Amount X Order Price) |
| 204 | Buy order is currently unavailable. Please check the notice. |
| 10155 | Invalid API Key |


© Streami, Inc. All right reserved.


