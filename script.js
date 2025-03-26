document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  const form = document.getElementById("logForm");
  const savedMsg = document.getElementById("savedMsg");
  const logList = document.getElementById("logList");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = document.getElementById("task").value.trim();
    const insight = document.getElementById("insight").value.trim();
    const parenting = document.getElementById("parenting").value.trim();

    const entry = {
      date: today,
      task,
      insight,
      parenting
    };

    const logs = JSON.parse(localStorage.getItem("ganesha_logs") || "[]");
    logs.push(entry);
    localStorage.setItem("ganesha_logs", JSON.stringify(logs));

    savedMsg.textContent = "保存しました！";
    form.reset();
    dateInput.value = today;
    renderLogs();
  });

  function renderLogs() {
    const logs = JSON.parse(localStorage.getItem("ganesha_logs") || "[]");
    logList.innerHTML = "";

    logs.slice().reverse().forEach(log => {
      const div = document.createElement("div");
      div.className = "log-entry";
      div.innerHTML = `
        <strong>${log.date}</strong><br/>
        <b>課題:</b> ${log.task}<br/>
        <b>気づき:</b> ${log.insight}<br/>
        <b>子育て:</b> ${log.parenting || "（記入なし）"}
      `;
      logList.appendChild(div);
    });
  }

  renderLogs();

  document.getElementById("generateBlog").addEventListener("click", () => {
    const logs = JSON.parse(localStorage.getItem("ganesha_logs") || "[]");
    const title = document.getElementById("weeklyTitle").value || "（課題未入力）";

    const recentLogs = logs.slice(-7);
    let body = `タイトル：ガネーシャ課題チャレンジ｜今週のテーマ「${title}」

`;
    body += "今週も一歩ずつ進みました。
日々の暮らしの中で感じたこと、気づいたこと、そして娘たちに伝えたいことをまとめておきます。

";
    body += `■ 今週の課題：「${title}」

`;

    recentLogs.forEach((log, i) => {
      body += `【${i + 1}日目（${log.date}）】
・気づき：${log.insight}
・子育てとのつながり：${log.parenting || "（記入なし）"}

`;
    });

    body += "■ まとめのひとこと：
";
    body += "この課題を通じて、自分の中の何かに気づくことができた。
これを娘たちが読む頃には、きっと彼女たちの人生にも通じる何かがあると信じて。

";
    body += "ありがとう、ガネーシャ。
来週の課題も楽しみだ.";

    document.getElementById("blogOutput").value = body;
  });

  document.getElementById("copyBlog").addEventListener("click", () => {
    const text = document.getElementById("blogOutput");
    text.select();
    document.execCommand("copy");
    document.getElementById("copyMessage").textContent = "コピーしました！";
  });
});
