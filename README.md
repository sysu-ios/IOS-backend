# Feeds流后端API

`API`: http://localhost:3000/explorer

`url`: http://localhost:3000

`ip`: 172.18.32.213

使用时将IP地址替换`localhost`

## 时间日期

```
var myDate = new Date();  
myDate.getYear(); *//获取当前年份(2位)*  
myDate.getFullYear(); *//获取完整的年份(4位,1970-????)*  
myDate.getMonth(); *//获取当前月份(0-11,0代表1月)         // 所以获取当前月份是myDate.getMonth()+1;*   
myDate.getDate(); *//获取当前日(1-31)*  
myDate.getDay(); *//获取当前星期X(0-6,0代表星期天)*  
myDate.getTime(); *//获取当前时间(从1970.1.1开始的毫秒数)*  
myDate.getHours(); *//获取当前小时数(0-23)*  
myDate.getMinutes(); *//获取当前分钟数(0-59)*  
myDate.getSeconds(); *//获取当前秒数(0-59)*  
myDate.getMilliseconds(); *//获取当前毫秒数(0-999)*  
myDate.toLocaleDateString(); *//获取当前日期*  
var mytime=myDate.toLocaleTimeString(); *//获取当前时间*  
myDate.toLocaleString( ); *//获取日期与时间*  
```



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

#### 免密登陆`get`

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

#### 密码登陆`post`

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

#### 忘记密码(设置新密码)`post`

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

#### 注册`post`

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

#### 获取详细信息`get`

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
      "PostNum": 0,
      "PraiseNum": 0,
      "AttentionNum": 0,
      "FanNum": 0,
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

#### 更新详细信息`post`

```
http://localhost:3000/api/account/updateUser
```

参数：

```js
{
"PhoneNumber": "17620124726",
"UserName": "test",
"UserIcon": "base64 string",
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

## 关注

#### 关注`post`

```
http://localhost:3000/api/subscribe
```

参数：

```json
{
  "first": "17620124723",
  "second": "17620124724"
}
```

返回：

```json
{
  "first": "string",
  "second": "string"
}
```

#### 取消关注`post`

```
http://localhost:3000/api/subscribe/delete
```

参数：

```json
{
  "first": "string",
  "second": "string"
}
```

返回：

```json
//成功
{
  "response": {
    "code": 201,
    "message": "success"
  }
}
```

#### 获取用户的关注列表`get`

```
http://localhost:3000/api/subscribe/getByPhone
```

参数：

```json
phone: "17620124723"
```

返回：

```json
//成功
{
  "response": {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 1,
        "first": "17620124723",
        "second": "17620124724"
      },
      {
        "id": 2,
        "first": "17620124723",
        "second": "17620124725"
      }
    ]
  }
}
//失败
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no subscribe"
  }
}
```



#### 获取全部关注列表`get`

```
http://localhost:3000/api/subscribe
```

返回：

```json
[
  {
    "id": 2,
    "first": "17620124723",
    "second": "17620124725"
  },
  {
    "id": 3,
    "first": "17620124724",
    "second": "17620124725"
  },
  {
    "id": 4,
    "first": "string",
    "second": "string"
  }
]
```



## 文章

#### 发布文章`post`

```
http://localhost:3000/api/news/post
```

参数：

```json
{
  "Content": "string",
  "Picture": ["string","string","string"],
  "PhoneNumber": "17620124724"
}
```

返回：

```json
{
  "response": {
    "code": 201,
    "message": "success",
    "articleId": 3
  }
}
```

#### 删除文章`get`

```
http://localhost:3000/api/news/delete
```

参数：

```
id: 0
```

返回：

```json
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
    "error": "no subscribe"
  }
}
```

#### 图片上传`post`

```
http://localhost:3000/api/StorageFile/upload
```

图片`html`测试

http://localhost:3000

参数：

```
Upload one or more files into the specified container. The request body must use multipart/form-data which is the file input type for HTML uses.
可以参考
http://localhost:3000
采用multipart/form-data数据类型
可以一次上传多个文件
可以自动修改文件名
必须包含文件后缀
```

返回：

```json
//成功
//单文件
{
    "code": 200,
    "message": "success",
    "data": [{"id":9,
              "type":"image/png",
              "name":"snipaste_2019-06-04_14-20-161560957639894.png",
              "url":"/api/containers/common/download/snipaste_2019-06-04_14-20-161560957639894.png"
             }]
}
 
//多文件
{"code":200,"message":"success","data":[{"id":11,"type":"image/png","name":"snipaste_2019-06-04_14-18-031560957756108.png","url":"/api/containers/common/download/snipaste_2019-06-04_14-18-031560957756108.png"},{"id":10,"type":"image/png","name":"snipaste_2019-06-04_14-18-141560957756108.png","url":"/api/containers/common/download/snipaste_2019-06-04_14-18-141560957756108.png"}]}
{
    "code": 200,
    "message": "success",
    "data": [{"id":11,
              "type":"image/png",
              "name":"snipaste_2019-06-04_14-18-031560957756108.png",
              "url":"/api/containers/common/download/snipaste_2019-06-04_14-18-031560957756108.png"
             },
             {"id":10,
              "type":"image/png",
              "name":"snipaste_2019-06-04_14-18-141560957756108.png",
              "url":"/api/containers/common/download/snipaste_2019-06-04_14-18-141560957756108.png"}
            ]}
}

//失败
{
    "code":200,
    "message":"fail",
    "error":"No file content uploaded"
}
```

#### 请求关注用户的文章列表`get`

```
http://localhost:3000/api/news/getRecommendList
```

参数：

```json
phone: "17620124724"
```

返回：

```json
//成功
{
  "response": {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 2,
        "UserName": "test1",
        "UserIcon": "",
        "Content": "string",
        "Picture": [
          "string",
          "string",
          "string"
        ],
        "createdAt": "2019-06-19T15:54:11.636Z",
        "CommentNum": 0,
        "ShareNum": 0,
        "PraiseNum": 0
      },
      {
        "id": 3,
        "UserName": "test1",
        "UserIcon": "",
        "Content": "string",
        "Picture": [
          "string",
          "string",
          "string"
        ],
        "createdAt": "2019-06-19T16:07:53.321Z",
        "CommentNum": 0,
        "ShareNum": 0,
        "PraiseNum": 0
      },
      {
        "id": 4,
        "UserName": "test",
        "UserIcon": "",
        "Content": "string",
        "Picture": [
          "string",
          "string",
          "string"
        ],
        "createdAt": "2019-06-19T16:07:59.201Z",
        "CommentNum": 0,
        "ShareNum": 0,
        "PraiseNum": 0
      }
    ]
  }
}
//失败
//无订阅
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no subscribe"
  }
}
//无新闻
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no news"
  }
}

```

#### 请求自己发布的文章`get`

```
http://localhost:3000/api/news/getMyNewsList
```

参数：

```json
phone："17620124723"
```

返回：

```json
//成功
{
  "response": {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": 1,
        "UserName": "test",
        "UserIcon": "base64",
        "Content": "",
        "Picture": [
       "/api/containers/common/download/snipaste_2019-06-04_14-18-031560957756108.png"
        ],
        "createdAt": "2019-06-19T15:52:07.390Z",
        "CommentNum": 3,
        "ShareNum": 2,
        "PraiseNum": 2
      }
    ]
  }
}

//失败
//无用户
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no account"
  }
}
//无发布
{
  "response": {
    "code": 200,
    "message": "fail",
    "error": "no news"
  }
}
```

## 评论

#### 对文章发表评论`post`

```
http://localhost:3000/api/comment/post
```

参数：

```
{
  "ArticleId": 1,
  "UserPhone": "17620124723",
  "Content": "string"
}
```

返回：

