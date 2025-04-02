//管理者画面
document.addEventListener("DOMContentLoaded", function() {
    loadTeachers(); //教員一覧を表示
});

//パスワードの表示・非表示
function showOrHide(){
    //admin.htmlから取得
    let passField = document.getElementById("admin_pass"); //パスワード入力フィールド(id="admin_pass")
    let checkbox = document.getElementById("showpassword");
    if (checkbox.checked){ //チェックボックスの判定
        passField.type = "text"; //表示
    }else{
        passField.type = "password"; //非表示
    }
}

//教員登録
//入力フォームの値を取得
function registerTeacher(){
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

//ログアウト
function logout(){
    localStorage.removeItem("role");   //ローカルストレージのroleを削除
    window.location.href = "index.html" //ログイン画面に戻る
}