//パスワードの表示・非表示
function showOrHide(){
    //index.htmlから取得
    let passField = document.getElementById("user_pass"); //パスワード入力フィールド(id="pass")
    let checkbox = document.getElementById("showpassword");
    if (checkbox.checked){ //チェックボックスの判定
        passField.type = "text"; //表示
    }else{
        passField.type = "password"; //非表示
    }
}

//enter動作
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            userLogin(); // Enterキーが押されたら login() を実行
        }
    });
});



//ログイン判定
function userLogin(){
    let username = document.getElementById("user_username").value.trim();
    let password = document.getElementById("user_pass").value.trim();

    //空白のみの入力防止
    if(username === "" || password === ""){
        alert("ユーザ名とパスワードを入力してください");
        return;
    }

    //ユーザ名
    let correctUsername = "admin";
    //パスワード
    let correctPassword = "1234"

    if(username === correctUsername && password === correctPassword){
        alert("ログイン成功!");
        window.location.href = "home.html"; //home.htmlへ移動
    } else {
        alert("ユーザ名またはパスワードが間違っています");
    }
}

//日付・曜日を更新
function updateTime(){
    let now = new Date();
    let timeString = now.toLocaleTimeString();
    let dateString = now.toLocaleDateString('ja-JP',{
        year: 'numeric',month: '2-digit',day: '2-digit',weekday: 'long'
    });
    //home.htmleへアクセス
    document.getElementById("current-time").textContent = `現在時刻:${timeString}`;
    document.getElementById("current-date").textContent = `日付・曜日:${dateString}`;
}

//実行間隔
updateTime(); //最初に１回実行
//１秒ごとにupdateTimeを実行
setInterval(updateTime, 1000);

//出勤・退勤ボタンの処理
function recordAttendance(type){
    let now = new Date().toLocaleTimeString();
    //記録を表示
    let logArea = document.getElementById("attendance-log");

    //ログを作成
    let newLog = document.createElement("p");
    newLog.textContent = `${type}しました:${now}`;
    logArea.appendChild(newLog);

    alert(`${type}しました:${now}`);
}

//ログアウト
function logout(){
    window.location.href = "index.html" //ログイン画面に戻る
}