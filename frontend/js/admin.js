//管理者画面
document.addEventListener("DOMContentLoaded", function() {
    loadTeachers(); //教員一覧を表示
});

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

    //fatch APIを使ってサーバーにデータを送信
    fetch("/api/teachers", {
        method: "POST",
        headers: { //json形式でデータを送信
            "Conetent-Type": "applocation/json"
        },
        body: JSON.stringify(newTeacher)
    })
    .then(response => response.json()) //サーバーからレスポンスを受け取る
    .then(data => {
        alert(data.message); //登録メッセージ
        loadTeachers(); //教員一覧を更新
        clearForm();  //入力フォームをリセット
    })
    .catch(error => console.error("エラー:",error));
}