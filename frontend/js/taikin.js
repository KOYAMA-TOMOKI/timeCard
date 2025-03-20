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

    //仮のログイン情報
    let adminAccount = { username: "admin", password: "admin123" };
    let userAccount = { username: "teacher1", password: "teacher123" };

    //管理者画面へ
    if(username === adminAccount.username && password === adminAccount.password){
        alert("管理者としてログイン成功!");
        localStorage.setItem("role","admin");
        window.location.href = "admin.html"; //admin.htmlへ移動
    //ユーザ側へ
    } else if (username === userAccount.username && password === userAccount.password){
        alert("ユーザとしてログイン成功!");
        localStorage.setIteam("role","user");
        window.location.href = "home.html"; //home.htmlへ移動
    } else {
        alert("ユーザ名またはパスワードが間違っています");
    }
}

//不正ログイン防止
document.addEventListener("DOMContentLoaded", function() {
    let role = localStorage.getItem("role");
    if(role !== "admin"){
        alert("管理者権限がありません。ログインしてください");
        window.location.href = "index.html"; //ログイン画面に戻す
    }
});



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