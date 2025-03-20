//管理者画面
document.addEventListener("DOMContentLoaded", function() {
    loadTeachers(); //教員一覧を表示
});

//教員登録
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

    fetch("/api/teachers", {
        method: "POST",
        headers: {
            "Conetent-Type": "applocation/json"
        },
        body: JSON.stringify(newTeacher)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadTeachers(); //教員一覧を更新
        clearForm(); 
    })
    .catch(error => console.error("エラー:",error));
}