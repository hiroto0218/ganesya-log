document.addEventListener("DOMContentLoaded", async function () {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const today = new Date();
  const dayName = weekdays[today.getDay()];
  const weekKey = `${today.getFullYear()}-W${getWeekNumber(today)}`;

  const res = await fetch("ganesha_tasks_extended.json");
  const tasks = await res.json();

  const overrideKey = weekKey + "_override_index";
  const overrideIndex = localStorage.getItem(overrideKey);
  const baseIndex = getWeekNumber(today) % tasks.length;
  const taskIndex = overrideIndex ? parseInt(overrideIndex) : baseIndex;
  const task = tasks[taskIndex % tasks.length];

  document.getElementById("weekly-task-title").textContent = task.title;
  document.getElementById("task-intention").textContent = task.intention;
  document.getElementById("task-effect").textContent = task.effect;
  document.getElementById("daily-advice").textContent = task.advice[dayName];
  document.getElementById("memoHint").textContent = "何を感じた？何をした？小さな一歩でもOK。";

  const memoKey = weekKey + "_memo";
  const savedMemo = localStorage.getItem(memoKey);
  if (savedMemo) document.getElementById("dailyMemo").value = savedMemo;

  document.getElementById("saveMemoButton").addEventListener("click", () => {
    const m = document.getElementById("dailyMemo").value;
    localStorage.setItem(memoKey, m);
    document.getElementById("memoStatus").textContent = "保存しました！";
  });

  const completeKey = weekKey + "_completed";
  const completed = localStorage.getItem(completeKey);
  if (completed) {
    document.getElementById("taskCompleteStatus").textContent = "この課題は達成済みです！";
  }

  document.getElementById("completeTaskButton").addEventListener("click", () => {
    localStorage.setItem(completeKey, "true");
    const newIndex = (taskIndex + 1) % tasks.length;
    localStorage.setItem(overrideKey, newIndex.toString());
    location.reload(); // 再読み込みして次の課題を表示
  });

  // 履歴一覧の生成（課題＋達成＋メモ）
  const historyDiv = document.getElementById("historyArea");
  let historyEntries = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_memo")) {
      const wk = key.replace("_memo", "");
      const memo = localStorage.getItem(key);
      const complete = localStorage.getItem(wk + "_completed");
      const idx = localStorage.getItem(wk + "_override_index") || (parseInt(wk.split("-W")[1]) % tasks.length);
      const taskTitle = tasks[idx % tasks.length]?.title || "(課題不明)";
      historyEntries.push({ week: wk, title: taskTitle, memo: memo, completed: !!complete });
    }
  }

  historyEntries.sort((a, b) => a.week.localeCompare(b.week));

  historyDiv.innerHTML = historyEntries.map(e => `
    <div class="history-entry">
      <strong>${e.week}</strong>：${e.title} ${e.completed ? "（達成）" : ""}
      <div class="history-memo">メモ：${e.memo}</div>
    </div>
  `).join("");

  document.getElementById("generateBlogButton").addEventListener("click", () => {
    const m = document.getElementById("dailyMemo").value;
    const t = `【今週の課題】\n${task.title}\n
【なぜこの課題？】\n${task.intention}\n
【この課題をやり遂げると？】\n${task.effect}\n
【今日のアドバイス】\n${task.advice[dayName]}\n
【今日の実行メモ】\n${m || "（まだ書いていません）"}`;
    document.getElementById("blogTemplate").value = t;
    document.getElementById("copyStatus").textContent = "";
  });

  document.getElementById("copyBlogBtn").addEventListener("click", () => {
    const t = document.getElementById("blogTemplate");
    t.select();
    document.execCommand("copy");
    document.getElementById("copyStatus").textContent = "コピーしました！";
  });

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }
});