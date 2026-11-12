// ===== 並べるアプリ（増やすときはここに1行足すだけ） =====
// 画面(index.html)とオフライン用の係(sw.js)の両方がこのファイルを読む。
// アイコンもここから自動でオフライン用に取っておくので、sw.js は直さなくてよい
const APPS = [
  { name: "ルシベル本部", desc: "タスクとAI（PCが起動中のとき）", icon: "icons/hq.png", url: "https://desktop-j7eonh1.tail11d529.ts.net/", wide: true },
  { name: "my喫茶", desc: "コーヒーを淹れる", icon: "icons/kissa.png", url: "https://rusiberu.github.io/my-kissa/" },
  { name: "レシピ帳", desc: "料理レシピと献立", icon: "icons/recipe.png", url: "https://rusiberu.github.io/recipe-ap/" },
  { name: "ポイ活手帳", desc: "ポイントの記録", icon: "icons/poikatsu.png", url: "https://sparkling-lily-6a1099.netlify.app" },
  { name: "かぞくチャット", desc: "3人だけのチャット", icon: "icons/chat.png", url: "https://kazoku-chat-rusi.netlify.app" },
  { name: "パスワード金庫", desc: "IDとパスワードの保管", icon: "icons/vault.png", url: "https://rusiberu.github.io/password-vault/" },
];
