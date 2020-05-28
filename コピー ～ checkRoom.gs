// これはコピーです

function checkRoom_copy(e) {  //e=全部の情報
  var ss = SpreadsheetApp.getActive();  //スプレッドシート  ss=ピカチュウ
  var sheet = ss.getActiveSheet();   //スプレッドシートのページを取ってくる　取得のページが不安定
  var sheet = ss.getSheetByName('会議室情報');  //ページの指定
  /*
  var requestJSON = e.postData.contents;  //postData=LMの情報　contents=bodyの部分　　
  var requestObj = JSON.parse(requestJSON); //JSONをjsオブジェクトにパース　　文字列をJSONオブジェクトに変える
  var apiKey = "ec225bc650aa1b11b7ab18677c67e9deae35ffda08326022e03304ef92024097";
  var secretKey = "ef1ce0b794cc78d8e57b113d3b792c8164aabc998281413b2000846c5cdaa47e";  // 認証方法
  var jid = requestObj["replyToJid"];
  var requestUri = "/api/1.0/talks/" + jid + "/messages"; // 名前・場所の識別
  var hostname = "cmdevelop.lakeel.com"; // サーバー
  var url = "https://" + hostname + requestUri;
  var contentType = "application/json";
  var timestamp = (new Date()).toISOString();
  */
  
  var startRow = 2; //取得開始位置の行
  var startColumn = 1; //取得開始位置の列
  var lastRow = sheet.getLastRow(); //最後の行
  var lastCol = 5; //最後の列
  
  var sheetdata = sheet.getSheetValues(startRow, startColumn, lastRow-1, lastCol); //「会議id」「Jid」「name」「title」「Answer」「date」「time」「reason」の順に入ってる
  //  console.log(sheetdata);
  
  //var temp = requestObj["body"].split(/\s/); //メッセージ本文をスペース区切りで配列に格納
  var temp = "会議室確認 2020-05-27 1400 1800";
  var temp2 = temp.split(/\s/); 
  var roomdata = [];  
  var roomlist = ["room_A", "room_B", "room_C", "room_D", "room_E"];
  for(var i = 0; i < sheetdata.length; i++){
    if(sheetdata[i][2] == temp2[1]){ //sheetdataの会議idと入力の会議idが一致したらTRUE
      roomdata.push([sheetdata[i][1], sheetdata[i][2], sheetdata[i][3], sheetdata[i][4]]);  //i行目のroomdata(name~end)が入った配列
    }
  }
  console.log(roomdata);
  // 以下で空き時間判定
  let room_blank = [];
  var daburi = 0;
  var tasita = 0;
  
  for(var k = 0; k < roomlist.length; k++){
    /* for(var i = parseInt(temp2[2]); i < parseInt(temp2[3]); i+=30){ //指定した開始時間と終了時間を参照
    if(i % 100 == 60){ //時刻に直すやつ
    i += 10;
    continue;
    }
    if(i % 100 == 30){ //開始分が30のときは70を足して次の時刻00にする 
    tasita = i + 70;
    }else{
    tasita = i + 30;
    }*/
    
    for(var j=0; j < roomdata.length; j++){　//会議室の予約情報分だけfor文を回す
      if(parseInt(temp2[2]) < parseInt(roomdata[j][3]) && parseInt(temp2[3]) > parseInt(roomdata[j][2]) && roomdata[j][0] == roomlist[k]){ 
        //判定開始時刻 < 予定終了時刻 && 判定終了時刻 > 予定開始時刻
        //1400 <= 1430 && 1800 >= 1100 && room_C == room_C 
        daburi = 1;
      }else{
        //console.log(parseInt(jdata[j]['終了時刻']));
      }
    }
    if(daburi == 1){
      room_blank.push(`${roomlist[k]}: ❌`);
      daburi = 0;
    }else{                           
      room_blank.push(`${roomlist[k]}: 🔴`);
    }
  }    
  
  console.log(room_blank);
}
