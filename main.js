//htmlからaddbtnを読み込んで変数に格納
const btn = document.getElementById("addBtn");

//ボタンを押したときの動作
btn.addEventListener('click', async()=>{
    //htmlのやることと時間を入れる場所を取得する
    const text = document.getElementById("todoInput").value;
    const time = document.getElementById("deadlineInput").value;
    
    //サーバーにデータを格納するからサーバーに今から送ることを伝える
    await fetch("http://localhost:3000/todos",{
        //それは新しくデータを作る処理だということを伝える
        method: "POST",
        //今から送るデータのコンテンツのタイプはjsonファイルですよと伝える
        headers: {"Content-Type": "application/json"},
        //textとtimeをjsonファイルに変換して送る
        body: JSON.stringify({ text, time})
    });
    
    
    
    //ボタンを押して配列を入れた後に入力欄の文字を消している
    document.getElementById("todoInput").value = "";
    document.getElementById("deadlineInput").value = "";
    await loadTodos();
});

//
async function loadTodos() {
    //resにサーバーのtodoの一覧を入れるためにリクエストを送る
    const res = await fetch("http://localhost:3000/todos");
    //サーバーから返ってきたjsonファイルをjsの配列に変換する
    const todos = await res.json();
    //index.htmlの<ul>を取得する
    const list = document.getElementById("todoList");
    //既に表示されてるtodo一覧があると二重に表示されるため一回画面の表示を消す
    list.innerHTML = "";
 
    //サーバーから返ってきた配列を１件づつ処理をする
    todos.forEach(todo => {
        //htmlに<li>を作ってる→メモリ内の処理
        const li = document.createElement("li");
        //<li>の中に文字列を入れている→メモリ内の処理
        li.textContent = `${todo.text} - ${todo.time}`;

        // 削除ボタンを作成→メモリ内の処理
        const delbtn = document.createElement("button");
        delbtn.textContent = "削除";

        // 削除ボタンを押したときの動作
        delbtn.addEventListener("click", async () => {
            //どのデータを消すかを指定
            await fetch(`http://localhost:3000/todos/${todo.id}`, {
                //指定したデータを消去する
                method: "DELETE"
            });
            await loadTodos();
        });

        // li にボタンを追加→htmlに反映
        li.appendChild(delbtn);

        // list に li を追加→htmlに反映
        list.appendChild(li);
    });
}
loadTodos();


