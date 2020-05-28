function checkResultDB(e){
  var ss = SpreadsheetApp.getActive()
  var sheet = ss.getSheetByName('投票結果'); //シート指定
  //var requestJSON = e.postData.contents;
  //var requestObj = JSON.parse(requestJSON); //JSONをjsオブジェクトにパース
  
  var startRow = 2; //取得開始位置の行
  var startColumn = 1; //取得開始位置の列
  var lastRow = sheet.getLastRow(); //最後の行
  var lastCol = sheet.getLastColumn(); //最後の列
  
  var sheetdata = sheet.getSheetValues(startRow, startColumn, lastRow-1, lastCol); //「会議id」「Jid」「name」「title」「Answer」「date」「time」「reason」の順に入ってる
  
  //var temp = requestObj["body"].split(/\s/); //メッセージ本文をスペース区切りで配列に格納 「結果確認」「会議id」の順
  var temp = ['test', '15'];
  var votelist = {};
  
  for(var i = 0; i < sheetdata.length; i++){
   // console.log(sheetdata[i][0]);
    if(sheetdata[i][0] == temp[1]){
      votelist[sheetdata[i][2]] = sheetdata[i][4];
      console.log(sheetdata[i][0]);
    }
  }
  var state = "";
  for(key in votelist){
    state += key + ":" + votelist[key] + "\n";
  }
  console.log(state);
  /*
  var apiKey = "ec225bc650aa1b11b7ab18677c67e9deae35ffda08326022e03304ef92024097";     //LM_Schedule_botのapiキー
  var secretKey = "ef1ce0b794cc78d8e57b113d3b792c8164aabc998281413b2000846c5cdaa47e";  //LM_Schedule_botのsecretキー
  var jid = requestObj["replyToJid"]; //Jidに取ってきたオブジェクトのreplyToJidを指定
  var requestUri = "/api/1.0/talks/" + jid + "/messages"; //"/messages"の部分でメッセージの形式を指定（今回はメッセージ）
  var hostname = "cmdevelop.lakeel.com";
  var url = "https://" + hostname + requestUri;
  var contentType = "application/json";
  var timestamp = (new Date()).toISOString();

  var body = JSON.stringify({
        "body": votelist
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
    UrlFetchApp.fetch(url, options);　//HTTPリクエストを送る関数
  */
}