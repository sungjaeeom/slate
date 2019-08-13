---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript
  - php
  - python
  

toc_footers:
  - <a href='javascript:getApiKey()'>Issue API Key</a>
  - <a href='javascript:apiGitHome()'>Github</a>

toc_footers_add:
  - API history
  - <a href='javascript:goAPIhistory("index.en.html")' >latest</a>
  - <a href='javascript:goAPIhistory("index.en.v.0.1.html")' >V0.1</a> 

lang_change: true

search: false
---

# Guide

Welcome to the GOPAX API!

The following documents are shared to enable you to use some of the features of GOPAX through the REST API.

## API Endpoint (URL)

GOPAX REST API provides endpoints for account/order management and public market data.

<code id="apiUrl" ></code>

## API Call Rate Limit

When the API call rate limit is exceeded, the status code 429 - Too Many Requests will be returned.

The rate is limited per IP for Public API and per API Key for Private API. At most 20 calls can be made within the 1 second moving window, respectively.

## Request/Response Format

The content-type for all requests and responses is application/json, and follows typical HTTP response status codes. For example, a successful request will return status code 200.

# Private API Authentication

In order to authenticate for the Private API, the following HTTP header must be included in the REST request.

1. API-KEY: the issued API Key
2. SIGNATURE: the message signature value (further description below)
3. NONCE: a constantly increasing non-redundant value (typically, timestamp)

<aside class="success">
You can issue two or more API keys.
</aside>

<aside class="warning">
If identical NONCE values are used, the server will reject the request.
</aside>

<aside class="notice">
The content-type of the HTTP body should be application/json.
</aside>

## SIGNATURE formation procedure

> The below is example :

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


1. Perform string-concatenation of the following in order.
  1. NONCE of the header
  2. HTTP method (ALL CAPS): 'GET', 'POST', 'DELETE' or such
  3. API endpoint URL (e.g. '/orders', '/trading-pairs/ETH-IDR/book')
  4. Request parameter body in JSON format (if not applicable, do not add any string)
2. Decode the issued secret in base64.
3. Use the value from 2. as the secret key and sign as sha512 HMAC.
4. Encode the value from 3. in base64.

<aside class="warning">
The Secret Key is generated when the API key is issued. If the Secret Key is lost, you must reissue the <a href="https://www.gopax.co.kr/account">API Key</a>.
</aside>

## HTTP header example

<code class="block" >
API-KEY: 128f0123-2a5d-48f5-8f19-e937f38f0a99
SIGNATURE: gn2poOBVCAd5GLqXFAZGK9Pk4VD7+OaNtDIkFjejwIBjBm1X/DYPZVAP1rex6XqwH8vHt36ap26lTN85HVJz2g==
NONCE: 1520994527165
Content-Type: application/json
</code>

<aside class="warning">
The above example cannot be used for testing. Create it through <a href="https://www.gopax.co.kr/account">personal API Key</a>
</aside>

# Authenticated Calls

## Get balances

> Response : 

```json
[
  {
    "asset": "KRW",
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
| Asset Name | Asset Name. You can view the entire list in the [Asset List Query] |
| Avail | Transactionable Amount (Quantity) |
| Hold | Outstanding Amount(Quantity) |
| Pending Withdrawal | Amount in Withdrawal(Quantity) |

## Get balance by asset name

> Response : 

```json
{
  "asset": "KRW",
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
| Asset Name | Asset Name. You can view the entire list in the [Asset List Query] |

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
    "tradingPairName": "CND-KRW",
    "side": "sell",
    "type": "limit",
    "createdAt": "2018-01-08T12:44:03.000Z"
  }, {
    "id": "23916",
    "price": 90,
    "amount": 30,
    "tradingPairName": "CND-KRW",
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
| Type | Order Type (`limit`) |
| Created At | Order Time |

<aside class="notice">
All API timestamps is returned in microseconds according to the ISO 8601 format.
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
  "tradingPairName": "CND-KRW",
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

| Value | DEscription |
| --- | --- |
| ID	| Unique No. of order |
| Status | 상태 placed: 주문됨, cancelled: 취소됨, completed: 체결됨, updated: 부분 체결됨 |
| Side | Trading Type (`buy` , `sell`) |
| Type | Order Type (`limit`) |
| Price | Order Price |
| Amount | Order Amount |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |
| Created At | Order Time |

<aside class="notice">
All API timestamps is returned in microseconds according to the ISO 8601 format
</aside>

## Place order

> Example of buying ETH-KRW by limit order

```json
{
    "type": "limit",
    "side": "buy",
    "price": 1000000,
    "amount": 10,
    "tradingPairName": "ETH-KRW"
}
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
| Type | Order Type (`limit`) |
| Side | Trading Type (`buy`, `sell`) |
| Price | Order Price |
| Amount | Order Amount |
| Trading Pair | Trading Pair. You can check the entire list in the [trading pair list] query. |

<aside class="warning">
When ordered at market price, Amount is the total amount of assets to be purchased or sold (KRW for purchase in ETH-KRW and ETH for sale in ETH-KRW).
</aside>

### Description of Response
> Response : 

```json
{
  "id": "98723",
  "price": 750000,
  "amount": 9,
  "tradingPairName": "ETH-KRW",
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
| Type | Order Type (`limit`) |
| Created At | Order Time |

<aside class="notice">
All API timestamps is returned in microseconds according to the ISO 8601 format.
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
    "tradingPairName": "BTC-KRW"
  }, {
    "id": 23302,
    "orderId": 23916,
    "baseAmount": 0.00149051,
    "quoteAmount": 15399.94932,
    "fee": 0,
    "price": 10332000,
    "timestamp": "2018-03-10T16:03:54.000Z",
    "side": "buy",
    "tradingPairName": "BTC-KRW"
  }
]
```
### HTTP request
`GET /trades`

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
All API timestamps is returned in microseconds according to the ISO 8601 format
</aside>

# Unauthenticated Calls

## Get assets
> Response :

```json
[
  {
    "id": "KRW",
    "name": "대한민국 원"
  }, {
    "id": "ETH",
    "name": "이더리움"
  }, {
    "id": "BTC",
    "name": "비트코인"
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
    "name": "ETH-KRW",
    "baseAsset": "ETH",
    "quoteAsset": "KRW"
  }, {
    "name": "BTC-KRW",
    "baseAsset": "BTC",
    "quoteAsset": "KRW"
  }, {
    "name": "BCH-KRW",
    "baseAsset": "BCH",
    "quoteAsset": "KRW"
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
All API timestamps is returned in microseconds according to the ISO 8601 format
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
| level | Option | 호가창의 상세정보 수준<br><br>1 = 매수호가 및 매도호가<br>2 = 매수 및 매도 주문 각 50개<br>기타 = 호가창 전체 |

## Get recent trades

### HTTP request
`GET /trading-pairs/<Trading Pair>/trades`

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
}
</code>

| Value | Description |
| --- | --- |
| Time | Trading Time |
| ID | Unique No. of Trade |
| Price | Trading Price |
| Amount | Trading Amount |
| Side | Trading Type (`buy`, `sell`) |

<aside class="notice">
All API timestamps is returned in microseconds according to the ISO 8601 format
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

| 값 | Description |
| --- | --- |
| Open | Price 24hrs ago |
| High | 24-hour peak price |
| Low | 24-hour low |
| Close | Current price (Renew every minute) |
| Volume | 24-hour trading volume |
| Time | Latest data renewal time |

<aside class="notice">
All API timestamps is returned in microseconds according to the ISO 8601 format
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
    "name": "ETH-KRW",
    "open": 780000,
    "high": 784000,
    "low": 756000,
    "close": 763500,
    "volume": 1602.93236136,
    "time": "2018-03-14T05:13:08.364Z"
  }, {
    "name": "BTC-KRW",
    "open": 10308000,
    "high": 10362500,
    "low": 9901000,
    "close": 10074000,
    "volume": 1687.88476801,
    "time": "2018-03-14T05:12:08.245Z"
  }, {
    "name": "BCH-KRW",
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
Description of ResponseAll API timestamps is returned in microseconds according to the ISO 8601 format
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
