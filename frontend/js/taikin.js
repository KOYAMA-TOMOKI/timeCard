// パスワードの表示・非表示
function showOrHide() {
    let passField = document.getElementById("user_pass"); // パスワード入力フィールド(id="user_pass")
    let checkbox = document.getElementById("showpassword");
    if (checkbox.checked) { // チェックボックスの判定
        passField.type = "text"; // 表示
    } else {
        passField.type = "password"; // 非表示
    }
}

// 出勤・退勤を記録する関数
async function recordAttendance(type) {
    const userId = document.getElementById("user_id").value.trim(); // ユーザーIDを取得

    // ユーザーIDが入力されていない場合、アラートを表示
    if (!userId) {
        alert("ユーザーIDを入力してください");
        return;
    }

    try {
        // 出勤または退勤のAPIリクエスト
        const response = await fetch("http://localhost:3000/api/attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                type: type  // 出勤(clock_in) または 退勤(clock_out)
            })
        });

        // レスポンスの処理
        const data = await response.json();
        if (response.ok) {
            alert(data.message); // 成功メッセージ
        } else {
            alert(data.message || "エラーが発生しました");
        }
    } catch (error) {
        console.error("出退勤記録エラー:", error);
        alert("出退勤記録に失敗しました");
    }
}

// DOMがロードされた後に実行されるイベント
document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("userId"); // 例: localStorageからuserIdを取得
    const userIdInput = document.getElementById("user_id");

    if (userId && userIdInput) {
        userIdInput.value = userId; // localStorage から取得した userId を input 要素の value に設定
    }

    const clockInButton = document.getElementById("clock_in_button");
    const clockOutButton = document.getElementById("clock_out_button");

    // 出勤ボタンがクリックされたときに出勤を記録
    if (clockInButton) {
        clockInButton.addEventListener("click", function () {
            recordAttendance('clock_in');
        });
    }

    // 退勤ボタンがクリックされたときに退勤を記録
    if (clockOutButton) {
        clockOutButton.addEventListener("click", function () {
            recordAttendance('clock_out');
        });
    }

    // Enterキーでログイン処理
    let userPassInput = document.getElementById("user_pass"); // パスワード入力欄を取得
    userPassInput.addEventListener("keydown", function (event) { // パスワード入力欄だけ監視
        if (event.key === "Enter") {
            event.preventDefault(); // デフォルトのEnter動作を防ぐ
            userLogin(); // ログイン処理を実行
        }
    });
});

// ログイン判定(API認証)
async function userLogin() {
    let userId = document.getElementById("user_id").value.trim();
    let password = document.getElementById("user_pass").value.trim();
    // 入力チェック
    if (userId === "" || password === "") {
        alert("ユーザIDとパスワードを入力してください");
        return;
    }
    // API認証
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId, password: password })
        });
        // APIのレスポンスを取得
        const data = await response.json();
        // ログイン成功
        if (response.ok) {
            alert(`${data.role} としてログイン成功`);
            localStorage.setItem("role", data.role);
            if (data.role === "admin") { // 管理者ログイン
                window.location.href = "admin.html";
            } else { // ユーザログイン
                window.location.href = "home.html";
            }
        // ログイン失敗
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("ログイン処理エラー:", error);
        alert("サーバーとの通信に失敗しました");
    }
}

// 不正ログイン防止
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin.html")) { // admin.htmlのみチェック
        let role = localStorage.getItem("role");
        if (role !== "admin") {
            alert("管理者権限がありません。ログインしてください");
            window.location.href = "index.html"; // ログイン画面に戻す
        }
    }
});

// 実行間隔
function updateTime() {
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

// ログアウト
function logout() {
    localStorage.removeItem("role");   // ローカルストレージのroleを削除
    window.location.href = "index.html"; // ログイン画面に戻る
}