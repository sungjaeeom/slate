---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript
  - php
  - python
  

toc_footers:
  - <a href='javascript:getApiKey()' >API 키 받기</a>
  - <a href='javascript:apiGitHome()' >Github</a>

toc_footers_add:
  - API history
  - <a href='javascript:goAPIhistory("")' >latest</a>
  - <a href='javascript:goAPIhistory(".v.0.1")' >V0.1</a> 

lang_change: true

exchange: true

search: false
---

# 소개

Welcome to the GOPAX API!

REST API를 통해 GOPAX의 일부 기능을 이용하실 수 있도록 아래 문서를 공유합니다.

## REST API 주소

고팍스의 REST API는 계정/주문 관리 및 공개 마켓 데이터에 대한 엔드포인트를 제공합니다.

<code id="apiUrl" >https://api.gopax.co.kr</code>

## API 호출 횟수 제한

- API 호출 횟수 제한을 초과하면 429 - 요청 한도 초과 상태코드가 반환됩니다.
- 인증이 필요한 API는 API Key당, 인증이 필요하지 않은 API는 IP당 호출 횟수가 제한됩니다.
- 최근 1초의 구간 안에서 최대 20번의 API 호출이 가능합니다.

## 요청/응답 형식

모든 요청 및 응답의 content-type 은 application/json 이며, 통상적인 HTTP 상태코드를 준수합니다. 예를 들어 성공적으로 접속한 경우에는 200의 상태코드가 반환됩니다.

# 인증

Private API에 인증하기 위해, REST 요청에 항상 다음의 HTTP 헤더가 포함되어야 합니다.

1. API-KEY: 발급받은 API 키
2. SIGNATURE: 메시지 서명 값 ([* SIGNATURE 생성 과정](#signature))
3. NONCE: 중복되지 않고 계속 증가하는 값 (통상적으로 timestamp)

<aside class="success">
2개 이상의 API Key발급이 가능합니다.
</aside>

<aside class="warning">
같은 NONCE 값이 사용되면 서버에서 거부합니다.
</aside>

<aside class="notice">
HTTP 본문의 content-type은 application/json 으로 설정해야 합니다.
</aside>

## SIGNATURE 생성 과정

> 인증이 필요한 API는 아래 코드를 이용해주세요.:

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


1. 다음의 내용을 순서대로 문자열로 연결합니다.
  1. 헤더의 NONCE 값
  2. HTTP Method(대문자로): 'GET', 'POST', 'DELETE' 등
  3. API 엔드포인트 경로 (예: '/orders', '/trading-pairs/ETH-KRW/book')
  4. JSON 형식의 요청 변수 본문 (없을 경우 아무 문자열도 연결하지 마십시오)
2. 발급 받은 Secret Key를 base64로 디코딩합니다.
3. 2.의 값을 Secret key를 사용하여 sha512 HMAC 으로 서명합니다.
4. 3.의 값을 base64로 인코딩합니다. 

<aside class="warning">
Secret Key는 API Key 발급시 생성됩니다. Secret Key 분실시 <a href="javascript:getApiKey()">API Key</a>를 재발급 받으셔야 합니다.
</aside>

## HTTP 헤더 예제

<code class="block" >
API-KEY: 128f0123-2a5d-48f5-8f19-e937f38f0a99
SIGNATURE: gn2poOBVCAd5GLqXFAZGK9Pk4VD7+OaNtDIkFjejwIBjBm1X/DYPZVAP1rex6XqwH8vHt36ap26lTN85HVJz2g==
NONCE: 1520994527165
Content-Type: application/json
</code>

<aside class="warning">
위 예제는 테스트에 이용될 수 없습니다. <a href="javascript:getApiKey()">개인 API Key</a>를 통해서 생성해주세요.
</aside>

# 인증이 필요한 API

## 잔액 조회하기

> 결과 : 

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
### HTTP 요청
`GET /balances`

### 결과값 설명

<code class="block" >
{
  "asset": <i style="color: black;">[Asset Name]</i>,
  "avail": <i style="color: black;">[Avail]</i>,
  "hold": <i style="color: black;">[Hold]</i>,
  "pendingWithdrawal": <i style="color: black;">[Pending Withdrawal]</i>
}
</code>


| 값 | 설명 |
| --- | --- |
| Asset Name | 자산 이름. [자산 목록 조회하기](#c8b9dcea10)에서 전체 목록을 확인할 수 있습니다. |
| Avail | 거래 가능 금액(수량) |
| Hold | 미체결 금액(수량) |
| Pending Withdrawal | 출금 중인 금액(수량) |

## 자산 이름에 따라 잔액 조회하기

> 결과 : 

```json
{
  "asset": "KRW",
  "avail": 9101080.53,
  "hold": 0,
  "pendingWithdrawal": 0
}
```
### HTTP 요청
`GET /balances/<Asset Name>`
### URL 파라미터

| 파라미터 | 설명 |
| --- | --- |
| Asset Name | 자산 이름. [자산 목록 조회하기](#c8b9dcea10)에서 전체 목록을 확인할 수 있습니다. |

### 결과값 설명

<code class="block" >
{
  "asset": <i style="color: black;">[Asset Name]</i>,
  "avail": <i style="color: black;">[Avail]</i>,
  "hold": <i style="color: black;">[Hold]</i>,
  "pendingWithdrawal": <i style="color: black;">[Pending Withdrawal]</i>
}
</code>

| 값 | 설명 |
| --- | --- |
| Asset Name | 자산 이름. [자산 목록 조회하기](#c8b9dcea10)에서 전체 목록을 확인할 수 있습니다. |
| Avail | 거래 가능 금액(수량) |
| Hold | 미체결 금액(수량) |
| Pending Withdrawal | 출금 중인 금액(수량) |

## 주문 조회하기

> 결과 : 

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
### HTTP 요청
`GET /orders`
### 결과값 설명
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

| 값 | 설명 |
| --- | --- |
| ID	| 주문 고유번호 |
| Price | 주문 가격 |
| Amount | 주문 수량 |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |
| Side | 주문 구분 (`buy`: 구매 또는 `sell`: 판매) |
| Type | 주문 종류 (`limit`: 지정가, `market`: 시장가) |
| Created At | 주문 시각 |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

## 주문 ID로 주문 조회하기

> 결과 : 

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
### HTTP 요청signature_b64
`GET /orders/<Order Id>`
### 결과값 설명
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

| 값 | 설명 |
| --- | --- |
| ID	| 주문 고유번호 |
| Status | 상태 placed: 주문됨, cancelled: 취소됨, completed: 체결됨, updated: 부분 체결됨 |
| Side | 주문 구분 (`buy`: 구매, `sell`: 판매) |
| Type | 주문 종류 (`limit`: 지정가, `market`: 시장가) |
| Price | 주문 가격 |
| Amount | 주문 수량 |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |
| Created At | 주문 시각 |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

## 주문 등록하기

> 예제 :

```python
import time, base64, hmac, hashlib, requests, json

apikey = '' 
secret = ''  
nonce = str(time.time())
method = 'POST'
request_path = '/orders'

request_body = 
# ETH-KRW를 지정가로 100만원에 ETH 10개 매수
{
    "type": "limit",
    "side": "buy",
    "price": 1000000,
    "amount": 10,
    "tradingPairName": "ETH-KRW"
}
# ETH-KRW를 시장가로 ETH 10개 매도
{
      "type": "market",
      "side": "sell",
      "amount": 10,
      "tradingPairName": "ETH-KRW"
}
# ETH-KRW를 시장가로 100만원어치의 이더리움을 구매
{
    "type": "market",
    "side": "buy",
    "amount": 1000000,
    "tradingPairName": "ETH-KRW"
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
	req = requests.post(url = 'API End point URL' + request_path, headers = custom_headers,json=request_body)

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
// ETH-KRW를 지정가로 100만원에 ETH 10개 매수
{
    type: "limit",
    side: "buy",
    price: 1000000,
    amount: 10,
    tradingPairName: "ETH-KRW"
};
// ETH-KRW를 시장가로 ETH 10개 매도
{
    type: "market",
    side: "sell",
    amount: 10,
    tradingPairName: "ETH-KRW"
};
// ETH-KRW를 시장가로 100만원어치의 이더리움을 구매
{
    type: "market",
    side: "buy",
    amount: 1000000,
    tradingPairName: "ETH-KRW"
};

var body = JSON.stringify(json_body, Object.keys(json_body).sort());
var what = nonce + method + requestPath + body;
var key = Buffer(secret, 'base64');
var hmac = crypto.createHmac('sha512', key);
var sign = hmac.update(what).digest('base64');

var host = 'API End point URL';

var options = {
  method,
  body: json_body,
  json: true,
  url: `https://${host}${requestPath}`,
  headers: {
    API-KEY: apikey,
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

const API_HOST = 'API End point URL';
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

public function setParameter(string $type, string $side, float $price, float $amount, string $tradingPairName)
{
    $data['type']            = $type; // LIMIT, MARKET
    $data['side']            = $side; // BUY, SELL
    $data['price']           = $price;
    $data['amount']          = $amount;
    $data['tradingPairName'] = $tradingPairName;
    return json_encode($data);
}

$orderRequest = setParameter(
  // ETH-KRW를 지정가로 100만원에 ETH 10개 매수
   'limit', 'buy', 10000000, 0.1, 'ETH-KRW'
 );
 (
   // ETH-KRW를 시장가로 ETH 10개 매도
   'market', 'sell', 0, 10, 'ETH-KRW'
 );
 (
   // ETH-KRW를 시장가로 100만원어치의 이더리움을 구매
   'market', 'buy', 0, 1000000,'ETH-KRW'
 );

print_r($this->request('POST','/orders',$orderRequest));
    
```

### HTTP 요청
`POST /orders`
### 요청 본문 설명

<code class="block" >
{
  "type": <i style="color: black;">[Type]</i>,
  "side": <i style="color: black;">[Side]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "tradingPairName": <i style="color: black;">[Trading Pair]</i>
}
</code>

| 값 | 설명 |
| --- | --- |
| Type | 주문 종류 (`limit`: 지정가, `market`: 시장가) |
| Side | 주문 구분 (`buy`: 구매 또는 `sell`: 판매) |
| Price | 주문 가격 |
| Amount | 주문 수량 |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |

<aside class="warning">
시장가 주문시 amount는 자신이 지불할 자산의 총량(ETH-KRW에서 매수의 경우 KRW, ETH-KRW에서 매도의 경우 ETH)입니다.
</aside>

<aside class="warning">
 <a href="#rest-api">API Endpoint URL</a>을 확인하시기 바랍니다.
</aside>

### 결과값 설명

> 결과 : 

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

| 값 | 설명 |
| --- | --- |
| ID	| 주문 고유번호 |
| Price | 주문 가격 |
| Amount | 주문 수량 |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |
| Side | 주문 구분 (`buy`: 구매 또는 `sell`: 판매) |
| Type | 주문 종류 (`limit`: 지정가, `market`: 시장가) |
| Created At | 주문 시각 |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

## 주문 ID로 주문 취소하기

> 결과 : 

```json
{
}
```
### HTTP 요청
`DELETE /orders/<Order Id>`
### URL 파라미터

| 파라미터 | 설명 |
| --- | --- |
| Order Id	| 주문 고유번호 |

## 사용자 거래 기록 조회하기

> 결과 : 

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
### HTTP 요청
`GET /trades?limit=[limit]&pastmax=[pastmax]&latestmin=[latestmin]&after=[after]&before=[before]`

### Query 파라미터

| 파라미터 | 필수 여부 | 설명 |
| --- | --- | --- |
| limit | 선택 | 반환되는 항목의 갯수 (최대 100) |
| pastmax | 선택 | 이 ID보다 오래된 데이터를 제외함 |
| latestmin | 선택 | 이 ID보다 새로운 최신 데이터를 가져옴 |
| after | 선택 | 이 타임스탬프 이후의 데이터를 제외함 (ms 단위) |
| before | 선택 | 이 타임스탬프 이전의 데이터를 제외함 (ms 단위) |

### 결과값 설명

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

| 값 | 설명 |
| --- | --- |
| ID | 거래 고유번호 |
| Order ID | 주문 고유번호 |
| Base Amount | 거래 수량 (구매시 Fee 가 포함된 수량) |
| Quote Amount | 거래 수량 * 주문 가격 (판매시 Fee 가 포함된 금액) |
| Fee | 거래 수수료 수수료테이블 링크 |
| Price | 주문 가격 |
| Timestamp | 거래 체결 시간 |
| Side | 거래 체결 종류 (`buy` 또는 `sell`) |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

# 인증이 필요하지 않은 API

## 자산 목록 조회하기

> 결과 :

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
GOPAX 지갑에서 취급하는 모든 자산의 목록을 조회할 수 있습니다.

### HTTP 요청
`GET /assets`

## 거래쌍 목록 조회하기

> 결과 :

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
### HTTP 요청
`GET /trading-pairs`

## Ticker 조회하기

> 결과 :

```json
{
  "price": 10194500,
  "ask": 10195000,
  "bid": 10184500,
  "volume": 1752.05558316,
  "time": "2018-03-14T03:50:41.184Z"
}
```

### HTTP 요청
`GET /trading-pairs/<Trading Pair>/ticker`

### URL 파라미터
| 파라미터 | 설명 |
| --- | --- |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다 |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

## Orderbook 조회하기

### HTTP 요청
`GET /trading-pairs/<Trading Pair>/book`

### URL 파라미터
| 파라미터 | 설명 |
| --- | --- |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다 |

### Query 파라미터
| 파라미터 | 필수 여부 | 설명 |
| --- | --- | --- |
| level | 선택 | 호가창의 상세정보 수준<br><br>1 = 매수호가 및 매도호가<br>2 = 매수 및 매도 주문 각 50개<br>기타 = 호가창 전체 |

## 최근 체결 거래 조회하기

### HTTP 요청
`GET /trading-pairs/<Trading Pair>/trades?limit=[limit]&pastmax=[pastmax]&latestmin=[latestmin]&after=[after]&before=[before]`

### URL 파라미터
| 파라미터 | 설명 |
| --- | --- |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다 |

### Query 파라미터
| 파라미터 | 필수 여부 | 설명 |
| --- | --- | --- |
| limit | 선택 | 반환되는 항목의 갯수 (최대 100) |
| pastmax | 선택 | 이 ID보다 오래된 데이터를 제외함 |
| latestmin | 선택 | 이 ID보다 새로운 최신 데이터를 가져옴 |
| after | 선택 | 이 타임스탬프 이후의 데이터를 제외함 (ms 단위) |
| before | 선택 | 이 타임스탬프 이전의 데이터를 제외함 (ms 단위)  |

### 결과값 설명

> 결과 :

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
### 결과값 설명

<code class="block">
{
  "time": <i style="color: black;">[Time]</i>,
  "id": <i style="color: black;">[ID]</i>,
  "price": <i style="color: black;">[Price]</i>,
  "amount": <i style="color: black;">[Amount]</i>,
  "side": <i style="color: black;">[Side]</i>
}
</code>

| 값 | 설명 |
| --- | --- |
| Time | 거래 체결 시각 |
| ID | 거래 체결 고유번호 |
| Price | 거래 체결 가격 |
| Amount | 거래 체결 수량 |
| Side | 거래 체결 종류 (`buy` 또는 `sell`) |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

## 최근 24시간 통계 조회하기

> 결과 :

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

### HTTP 요청
`GET /trading-pairs/<Trading Pair>/stats`

### 결과값 설명

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

| 값 | 설명 |
| --- | --- |
| Open | 24시간 전의 가격 |
| High | 24시간 동안의 최고가 |
| Low | 24시간 동안의 최저가 |
| Close | 현재가 (1분마다 갱신) |
| Volume | 24시간 동안의 거래량 |
| Time | 최근 데이터 갱신 시각 |

<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다. 
</aside>

## 과거 기록 조회하기

> 결과 :

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
### HTTP 요청
`GET /trading-pairs/<Trading Pair>/candles?start=<Start>&end=<End>&interval=<Interval>`

### URL 파라미터
| 파라미터 | 설명 |
| --- | --- |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |

### Query 파라미터
| 파라미터 | 필수 여부 | 설명 |
| --- | --- | --- |
| Start | 필수 | 시작 시점 Timestamp (ms 단위) |
| End | 필수 | 종료 시점 Timestamp (ms 단위) |
| Interval | 필수 | 희망하는 시간 간격 (분 단위, 1/5/30/1440) |

### 결과값 설명

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

| 값 | 설명 |
| --- | --- |
| Time | 최근 데이터 갱신 시각 |
| Low | 24시간 동안의 최저가 |
| High | 24시간 동안의 최고가 |
| Open | 24시간 전의 가격 |
| Close | 현재가 (1분마다 갱신) |
| Volume | 24시간 동안의 거래량 |

## 모든 거래쌍의 최근 24시간 통계 조회하기

> 결과 :

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

### HTTP 요청
`GET /trading-pairs/stats`

### 결과값 설명

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

| 값 | 설명 |
| --- | --- |
| Trading Pair | 거래 쌍. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |
| Open | 24시간 전의 가격 |
| High | 24시간 동안의 최고가 |
| Low | 24시간 동안의 최저가 |
| Close | 현재가 (1분마다 갱신) |
| Volume | 24시간 동안의 거래량 |
| Time | 최근 데이터 갱신 시각 |


<aside class="notice">
ISO 8601 타임스탬프를 이용하고 있습니다.
</aside>

# Errors

## HTTP Status (응답 코드)
| 오류 코드 | 설명 |
| :---: | --- |
| 400 | 잘못된 요청 - 요청 형식이 유효하지 않음 |
| 401 | 권한 없음 - 잘못된 API 키 |
| 403 | 금지됨 - 요청한 리소스에 대한 접근 권한이 없음 |
| 404 | 찾을 수 없음 |
| 429 | 요청 한도 초과 - API 호출 횟수 제한 초과 |
| 500 | 내부 서버 오류 - 서버에 문제가 발생함 |

## GOPAX 오류

| 오류 코드 | 설명 |
| :---: | --- |
| 100, 106 | 자산 이름(Asset Name)이 올바르지 않음. [자산 목록 조회하기](#c8b9dcea10)에서 전체 목록을 확인할 수 있습니다. |
| 103 | 주문 종류(Type)가 올바르지 않음. |
| 101, 104 | 거래 쌍(Trading Pair)이 올바르지 않음. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |
| 105 | 거래 쌍(Trading Pair)이 일시적으로 비활성화 되어있음. [거래쌍 목록 조회하기](#ab37bf30de)에서 전체 목록을 확인할 수 있습니다. |
| 107 | 주문 수량이 올바르지 않음. |
| 108 | 주문 가격이 올바르지 않음. |
| 201 | 주문을 위한 잔고가 부족. |
| 202 | 주문 고유번호가 일치하지 않음. |
| 203 | 주문 수량 X 주문 가격이 너무 큼. |
| 204 | 현재 매수 주문이 허용되지 않음. 공지사항을 확인하십시오. |
| 10155 | API키가 올바르지 않음 |


© Streami, Inc. 모든 권리 보유.


