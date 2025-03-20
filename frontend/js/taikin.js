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
    let userId = document.getElementById("user_id").value.trim();
    let password = document.getElementById("user_pass").value.trim();
    //console.log("入力されたID:", userId);
    //console.log("入力されたパスワード:", password);
    if(userId === "" || password === ""){
        alert("ユーザIDとパスワードを入力してください");
        return;
    }
    let adminAccount = { id: "admin", password: "admin123" };
    let userAccount = { id: "teacher1", password: "teacher123" };
    //console.log("正しいユーザID:", userAccount.id);
    //console.log("正しいパスワード:", userAccount.password);
    if(userId === adminAccount.id && password === adminAccount.password){
        //console.log("管理者としてログイン成功");
        alert("管理者としてログイン成功!");
        localStorage.setItem("role","admin");
        window.location.href = "/frontend/admin.html";
    } else if (userId === userAccount.id && password === userAccount.password){
        //console.log("ユーザとしてログイン成功");
        alert("ユーザとしてログイン成功!");
        localStorage.setItem("role","user");
        window.location.href = "/frontend/home.html";
    } else {
        //console.log("ログイン失敗: IDまたはパスワードが違います");
        alert("ユーザIDまたはパスワードが間違っています");
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