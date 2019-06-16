# Feeds流后端API

## 状态码

- 200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
- 201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
- 202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
- 204 NO CONTENT - [DELETE]：用户删除数据成功。
- 400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
- 401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
- 403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
- 404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
- 406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
- 410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
- 422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
- 500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。

## 返回结果

- GET /collection：返回资源对象的列表（数组）
- GET /collection/resource：返回单个资源对象
- POST /collection：返回新生成的资源对象
- PUT /collection/resource：返回完整的资源对象
- PATCH /collection/resource：返回完整的资源对象
- DELETE /collection/resource：返回一个空文档

## 用户

#### 登陆

参数

- 免密登陆`get`

```
http://localhost:3000/api/account/loginNoPd
```
参数：
```
phone: "17620124723"
```

返回：

```js
//成功
{
  "response": {
    "code": 200,
    "message": "success"
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no account"
  }
}
```



- 密码登陆`post`

```
http://localhost:3000/api/account/loginByPd
```

参数：

```js
{
"PhoneNumber": "17620124723",
"Password": "test3" 
}
```

登录成功后返回用户详细信息，失败后返回失败原因

```js
//成功
{
  "response": {
    "code": 200,
    "message": "success"
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no account"
  }
}
```



- 忘记密码(设置新密码)`post`

参数：

```
http://localhost:3000/api/account/changePd
```

```js
{
"PhoneNumber": "17620124723",
"Password": "test" 
}
```

返回：

```js
//成功
{
  "response": {
    "code": 200,
    "message": "success"
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no account"
  }
}
```

#### 注册

`post`

```
http://localhost:3000/api/account/register
```

参数:

```js
{
"PhoneNumber": "17620124723",
"Password": "test",
"UserName": "test",
"UserIcon": ""
}
```

返回：

```js
//成功
{
  "response": {
    "code": 201,
    "message": "success"
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "exist account"
  }
}
```

#### 查询

- 根据手机号获取详细信息`get`

```
http://localhost:3000/api/account/findByPhone
```

参数:

```js
phone: "17620124723"
```

返回：

```js
//成功
{
  "response": {
    "code": 200,
    "message": "success",
    "data": {
      "id": 13,
      "PhoneNumber": "17620124726",
      "UserName": "test",
      "Password": "test",
      "UserIcon": "",
      "Email": null,
      "Introduction": null,
      "Sex": null,
      "Birthday": null,
      "Region": null,
      "PostNum": null,
      "PraiseNum": null,
      "AttentionNum": null,
      "FanNum": null,
      "createdAt": "2019-06-16T15:34:30.341Z",
      "lastModifiedAt": "2019-06-16T15:34:30.341Z"
    }
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no account"
  }
}
```

#### 更新

- 根据手机号更新详细信息`post`

```
http://localhost:3000/api/account/updateUser
```

参数：

```js
{
"PhoneNumber": "17620124726",
"UserName": "test",
"UserIcon": "",
"Introduction": "String",
"Sex": "String",
"Birthday": "String",
"Region": "String"
}
```

返回：

```js
//成功
{
  "response": {
    "code": 201,
    "message": "success"
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no account"
  }
}
```

