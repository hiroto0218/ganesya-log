async function loadWeeklyTask() {
  const response = await fetch('ganesha_tasks_extended.json');
  const tasks = await response.json();

  const today = new Date();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  const weekKey = "ganesha_week_task";
  const completedKey = "ganesha_task_log";
  const memoKey = "ganesha_task_memo";

  const currentWeek = `${today.getFullYear()}-W${getWeekNumber(today)}`;
  let weekData = JSON.parse(localStorage.getItem(weekKey));

  if (!weekData || weekData.week !== currentWeek) {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    weekData = { week: currentWeek, task: randomTask };
    localStorage.setItem(weekKey, JSON.stringify(weekData));
  }

  const task = weekData.task;
  document.getElementById("weekly-task-title").textContent = task.title;
  document.getElementById("daily-advice").textContent = task.advice[dayName] || "今日はお休み。";

  // 実行メモ読み込み
  const memoData = JSON.parse(localStorage.getItem(memoKey) || "{}");
  const memoField = document.getElementById("dailyMemo");
  const savedMemo = memoData[dayName] || "";
  memoField.value = savedMemo;

  const memoMsg = document.getElementById("memoSavedMsg");
  if (savedMemo) {
    memoMsg.textContent = "保存済み。いつでも訂正できます！";
  }

  document.getElementById("saveMemoBtn").addEventListener("click", () => {
    const memo = memoField.value;
    memoData[dayName] = memo;
    localStorage.setItem(memoKey, JSON.stringify(memoData));
    memoMsg.textContent = "メモを保存しました！再編集も可能です。";
  });

  document.getElementById("completeButton").addEventListener("click", () => {
    const log = JSON.parse(localStorage.getItem(completedKey) || "[]");
    log.push({ week: currentWeek, date: today.toISOString(), task: task.title });
    localStorage.setItem(completedKey, JSON.stringify(log));
    document.getElementById("completionMessage").textContent = "達成ログを保存しました！";
    renderHistory();
  });

  document.getElementById("generateBlogButton").addEventListener("click", () => {
    const memo = JSON.parse(localStorage.getItem(memoKey) || "{}");
    const lines = Object.keys(task.advice).map(day =>
      `・${day}曜：${task.advice[day]}${memo[day] ? " → 実行メモ：" + memo[day] : ""}`
    ).join("\n");

    const content = `今週の課題：「${task.title}」\n\n今週もこの課題を通して気づいたこと、考えたことをまとめておこう。\n\n${lines}\n\nこの課題を通じて、昨日の自分よりほんの少し前に進めた気がする。`;
    document.getElementById("blogTemplate").value = content;
  });

  document.getElementById("copyBlogBtn").addEventListener("click", () => {
    const textarea = document.getElementById("blogTemplate");
    textarea.select();
    document.execCommand("copy");
    document.getElementById("copyStatus").textContent = "コピーしました！";
  });

  renderHistory();
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function renderHistory() {
  const completedKey = "ganesha_task_log";
  const log = JSON.parse(localStorage.getItem(completedKey) || "[]");
  const historyArea = document.getElementById("historyArea");
  historyArea.innerHTML = "";

  if (log.length === 0) {
    historyArea.textContent = "まだ達成ログはありません。";
    return;
  }

  const grouped = {};
  log.forEach(entry => {
    if (!grouped[entry.week]) grouped[entry.week] = [];
    grouped[entry.week].push(entry.task);
  });

  for (const week in grouped) {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${week}</strong>：${grouped[week].join(" / ")}`;
    historyArea.appendChild(div);
  }
}

window.addEventListener("DOMContentLoaded", loadWeeklyTask);
