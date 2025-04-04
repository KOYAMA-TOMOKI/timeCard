//管理者画面

//パスワードの表示・非表示
// グローバルに登録する
window.showOrHide = function() {
    let passField = document.getElementById("admin_pass");
    let checkbox = document.getElementById("showpassword");
    if (checkbox.checked) {
        passField.type = "text";
    } else {
        passField.type = "password";
    }
}


//教員登録
//入力フォームの値を取得
window.registerTeacher = function() {
    //教員id
    let teacherId = document.getElementById("admin_id").value.trim();
    //教員名
    let teacherName = document.getElementById("admin_name").value.trim();
    //パスワード
    let teacherPass = document.getElementById("admin_pass").value.trim();
    //役職
    let teacherPost = document.getElementById("admin_post").value.trim();

    //空白チェック
    if(teacherId === "" || teacherName === "" || teacherPass === "" || teacherPost === ""){
        alert("全ての項目を入力してください");
        return;
    }

    //登録処理
    let newTeacher = {
        id: teacherId,
        name: teacherName,
        password: teacherPass,
        post: teacherPost
    };

    const baseURL = import.meta.env.VITE_API_URL; //.envから読み込む

    //fatch APIを使ってサーバーにデータを送信
    fetch(`${baseURL}/api/teachers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTeacher)
    })
    .then(response => response.json()) //サーバーからレスポンスを受け取る
    .then(data => { //jsonデータになれば
        alert(data.message); //登録メッセージ
        loadTeachers(); //教員一覧を更新
        clearForm();  //入力フォームをリセット
    })
    .catch(error => console.error("エラー:",error));
}

// 教員一覧を取得して表示
window.loadTeachers = function () {
    const baseURL = import.meta.env.VITE_API_URL;

    fetch(`${baseURL}/api/teachers`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("teacher_table");
            table.innerHTML = ""; // 表を一旦クリア

            data.forEach((teacher) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${teacher.id}</td>
                    <td>${teacher.name}</td>
                    <td>${teacher.post}</td>
                    <td><button onclick="deleteTeacher('${teacher.id}')">削除</button></td>
                `;
                table.appendChild(row);
            });
        })
        .catch(err => console.error("一覧取得エラー:", err));
};

// 教員削除
// 教員削除
window.deleteTeacher = function (teacherId) {
    console.log("削除する教員のID:", teacherId);
    const baseURL = import.meta.env.VITE_API_URL;
    console.log("削除リクエストのURL:", `${baseURL}/api/teachers/${teacherId}`);  // 追加確認用

    if (!confirm("本当に削除しますか？")) return;

    fetch(`${baseURL}/api/teachers/${teacherId}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message); // 削除メッセージ
        loadTeachers(); // 削除後にリストを更新
    })
    .catch(err => {
        alert('削除できませんでした。');
        console.error('削除エラー:', err);
    });
};

//教員一覧を取得
document.addEventListener("DOMContentLoaded", function() {
    loadTeachers(); //教員一覧を表示
});

window.clearForm = function () {
    document.getElementById("admin_id").value = "";
    document.getElementById("admin_name").value = "";
    document.getElementById("admin_pass").value = "";
    document.getElementById("admin_post").value = "";
    document.getElementById("showpassword").checked = false;
    document.getElementById("admin_pass").type = "password";
};

//CSVダウンロード
function downloadCSV() {
    const month = document.getElementById("month").value;
    const baseURL = import.meta.env.VITE_API_URL;

    if (!month) {
        alert("月を選択してください");
        return;
    }

    const url = `${baseURL}/download-csv?month=${month}`;
    window.open(url, "_blank");
}

//グローバル登録
window.downloadCSV = downloadCSV;

//ログアウト
//グローバル関数
window.logout = function () {
    localStorage.removeItem("role");   //ローカルストレージのroleを削除
    window.location.href = "index.html" //ログイン画面に戻る
}