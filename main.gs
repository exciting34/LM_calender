// GETリクエストに対する処理
function doGet(e) {
  return sendPost(e);
}

function sendPost(e) {
  var ss = SpreadsheetApp.getActive()
  var sheet = ss.getActiveSheet();
  var requestJSON = e.postData.contents;
  var requestObj = JSON.parse(requestJSON); //JSONをjsオブジェクトにパース
  var apiKey = "ec225bc650aa1b11b7ab18677c67e9deae35ffda08326022e03304ef92024097";
  var secretKey = "ef1ce0b794cc78d8e57b113d3b792c8164aabc998281413b2000846c5cdaa47e"; 
  var jid = requestObj["replyToJid"];
  var requestUri = "/api/1.0/talks/" + jid + "/messages";
  var hostname = "cmdevelop.lakeel.com";
  var url = "https://" + hostname + requestUri;
  var contentType = "application/json";
  var timestamp = (new Date()).toISOString();
  
  var message ="予定を登録しました";
  var body = JSON.stringify({
    "body": message
  });
  
  var signatureBase = url + "\n" +
    apiKey + "\n" +
    timestamp + "\n" +
    body;

var signature = Utilities.base64Encode(Utilities.computeHmacSha256Signature(signatureBase, secretKey, Utilities.Charset.UTF_8));

var options = {  //ajax --> gas形式
    "method": "POST",
    "headers": {
        "content-type": contentType,
        "x-lakeel-api-key": apiKey,
        "x-lakeel-timestamp": timestamp,
        "x-lakeel-signature": signature
    },
    "payload": body,

}
UrlFetchApp.fetch(url, options);　
  // sheet.getRange(10,10).setValue(signatureBase);
}


// POSTリクエストに対する処理
function doPost(e) {
  // JSONをパース
  if (e == null || e.postData == null || e.postData.contents == null) {
    return;
  }
  var requestJSON = e.postData.contents;
  var requestObj = JSON.parse(requestJSON); //JSONをjsオブジェクトにパース
  var temp = requestObj["body"].split(/\s/); //メッセージ本文をスペース区切りで配列に格納
  
  // 結果をスプレッドシートに追記
  if(temp[0] == '予定登録'){ //最初の単語で判別
    scheRegi(e);
  }else if(temp[0] == "出席"||temp[0] == "欠席"|| temp[0] == "未定"){
    voteRegi(e); 
  }else if(temp[0] == "投票"){
    createVote(e);
  }else if(temp[0] == "結果確認"){
    checkResult(e);
  }else if(temp[0] == '会議室確認'){
    checkRoom(e);
  }else if(temp[0] == '予定確認'){
    checkYotei(e);
  }else if(temp[0] == '投票リスト'){
    voteList(e);
  }
}

