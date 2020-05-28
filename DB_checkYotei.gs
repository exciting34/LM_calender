function checkYoteiDB(e) {
  var ss = SpreadsheetApp.getActive();  //スプレッドシート  ss=ピカチュウ
  var sheet = ss.getActiveSheet();   //スプレッドシートのページを取ってくる　取得のページが不安定
  var sheet = ss.getSheetByName('予定登録');  //ページの指定
  
  var startRow = 2; //取得開始位置の行
  var startColumn = 1; //取得開始位置の列
  var lastRow = sheet.getLastRow(); //最後の行
  var lastCol = sheet.getLastColumn(); //最後の列
  
  var sheetdata = sheet.getSheetValues(startRow, startColumn, lastRow - 1, lastCol); //「Jid」「name」「schedule」「date」「start」「end」の順に入ってる
  //.getSheetValuesは配列として取得するメソッド
  //  console.log(sheetdata);
  var LM = "予定確認 丸山大樹 6/1";
  var fromLM = LM.split(/\s/); //メッセージ本文をスペース区切りで配列に格納 
   
  var today = new Date();
  var thisyear = today.getFullYear();
  var dateLM = new Date(thisyear + "/" + fromLM[2]);
  console.log(dateLM);
  //指定した日付と人物の予定の行をスプレッドシートから取得してjdata[]（空き時間判定で利用）に格納
  var jdata = [];
  for (var i = 0; i < sheetdata.length; i++) {
    if (fromLM[1] == sheetdata[i][1] && dateLM.getTime() == sheetdata[i][3].getTime()) {
      jdata.push(sheetdata[i]); //名前と日付が一致したものを抽出して格納した配列
    } else if(fromLM[1] == "*" && dateLM.getTime() == sheetdata[i][3].getTime()){
      jdata.push(sheetdata[i]);
    }
  }
  
  
  //勤務時間判定 0900-1800固定
  var st = 900;
  var ed = 1800;
  if (((st % 100 == 0) || (st % 100 == 30)) && ((ed % 100 == 0) || (ed % 100 == 30))) {
    console.log("work-time ok");
  } else {
    console.log("work-time ng");
    throw new Error('勤務時間が30分単位になっていない');
  }
  
  //過去の日付判定
  if (Compare2now(fromLM[2])) {
    console.log("date ok");
  } else {
    console.log("date ng");
    throw new Error('過去の日付が指定されています');
  }
  
  //sheetDBにアクセスしてjdataに予定データを格納する
  /*
  var jdata = GetPos(ids, dates); sheetDBから持ってきた形式はオブジェクト
  console.log(jdata);
  */
  
  // --------------------------------------以下で空き時間判定----------------------------------------------------
  
  //jdataは二次元配列 
  let bl = [];
  let ti = [];
  var temp = 0;
  var seq = 0;
  var tasita = 0;
  for (var i = st; i < ed; i += 30) {
    if (i % 100 == 60) {
      i += 10;
      continue;
    }
    if (i % 100 == 30) { //開始分が30のときは70を足して次の時刻00にする 
      tasita = i + 70;
    } else {
      tasita = i + 30;
    }
    for (var j = 0; j < jdata.length; j++) { //行の長さを取りたいときはjdata.lengthでOK //列の長さを取りたいときはjdata[0].length
      if (i < parseInt(jdata[j][5]) && tasita > parseInt(jdata[j][4])) {
        temp = 1;
        //console.log(i <= parseInt(jdata[j]['終了時刻']) && i+30 >= parseInt(jdata[j]['開始時刻']));
      } else {
        //console.log(parseInt(jdata[j]['終了時刻']));
      }
    }
    if (temp == 1) { //重複がある（空き予定じゃない）場合
      temp = 0;
      if (seq = 1) {
        
      }
    } else {
      if (ti.length > 0) { //すでに空き予定があるか
        if (ti[ti.length - 1] + 30 == i || ti[ti.length - 1] + 70 == i) { //連続してるか
          seq = 1;
          bl.push(`${bl.pop().slice(0, 4)}~${('0000' + tasita).slice(-4)}`);
          ti.push(i);
        } else {
           bl.push(`${('0000' + i).slice(-4)}~${('0000' + tasita).slice(-4)}`);
           ti.push(i);
        }
     }else {
      //開始分が30のときは70を足して次の時刻00にする
       bl.push(`${('0000' + i).slice(-4)}~${('0000' + tasita).slice(-4)}`);
       ti.push(i);
     }
   }
  }
console.log(bl);
if (bl.length < 1) {
  bl.push("ありません");
} else {
  bl.push("以上が空き時間です");
}
//ワイルドカードのときは全員分の予定取得
if (fromLM[1] == "*") {
  fromLM = "全員";
}

//送る文字列生成 空き確認 名前 2020/6/1 2020/6/4 
var body = JSON.stringify({
  "body":   fromLM[1]+ "の" + fromLM[2] + "[" + st + "~" + ed + "]の空き時間は" + bl 
});
console.log(body);


}


function Compare2now(dateinput){　//fromLMをdateinputと再定義している
  //入力した日付と現在の日付を比較する（monthは0-11なので1引く)
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  var vYear = parseInt(dateinput.substr(0,4));
                var vMonth = parseInt(dateinput.substr(5,2)) -1;
                var vDay = parseInt(dateinput.substr(8,2));
                var adate = new Date(vYear, vMonth, vDay);
  if(adate.getTime() < today.getTime()){
    return false; //これは過去
  }else{
    return true; //これは今以降
  }
}
