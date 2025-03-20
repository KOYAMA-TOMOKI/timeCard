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
    let userPassInput = document.getElementById("user_pass");  //パスワード入力欄を取得
    userPassInput.addEventListener("keydown", function(event) { //パスワード入力欄だけ監視
        if (event.key === "Enter") {
            event.preventDefault(); // デフォルトのEnter動作を防ぐ
            userLogin(); // ログイン処理を実行
        }
    });
});





//ログイン判定
function userLogin(){
    let username = document.getElementById("user_username").value.trim();
    let password = document.getElementById("user_pass").value.trim();

    if(username === "" || password === ""){
        alert("ユーザ名とパスワードを入力してください");
        return;
    }

    let adminAccount = { username: "admin", password: "admin123" };
    let userAccount = { username: "teacher1", password: "teacher123" };

    if(username === adminAccount.username && password === adminAccount.password){
        console.log("管理者としてログイン成功: admin.html に遷移");
        alert("管理者としてログイン成功!");
        localStorage.setItem("role","admin");
        setTimeout(() => {
            window.location.href = "/frontend/admin.html";
        }, 500); // 0.5秒後にadmin.htmlに移動
    } else if (username === userAccount.username && password === userAccount.password){
        console.log("ユーザとしてログイン成功: home.html に遷移");
        alert("ユーザとしてログイン成功!");
        localStorage.setItem("role","user");
        setTimeout(() => {
            window.location.href = "/frontend/home.html";
        }, 500); // 0.5秒後にhome.htmlに移動
    } else {
        console.log("ログイン失敗: ユーザ名またはパスワードが間違っています");
        alert("ユーザ名またはパスワードが間違っています");
    }
}

//不正ログイン防止
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("admin.html")) { //admin.htmlのみチェック
        let role = localStorage.getItem("role");
        if (role !== "admin") {
            alert("管理者権限がありません。ログインしてください");
            window.location.href = "index.html"; //ログイン画面に戻す
        }
    }
});

//実行間隔
function updateTime(){
    let now = new Date();
    let timeString = now.toLocaleTimeString();
    let dateString = now.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long'
    });

    let timeElement = document.getElementById("current-time");
    let dateElement = document.getElementById("current-date");

    if (timeElement) {
        timeElement.textContent = `現在時刻: ${timeString}`;
    }
    if (dateElement) {
        dateElement.textContent = `日付・曜日: ${dateString}`;
    }
}

// 実行間隔
updateTime(); // 最初に1回実行
setInterval(updateTime, 1000); // 1秒ごとに updateTime を実行

//ログアウト
function logout(){
    localStorage.removeItem("role");   //ローカルストレージのroleを削除
    window.location.href = "index.html" //ログイン画面に戻る
}