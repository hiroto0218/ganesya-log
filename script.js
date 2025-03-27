async function loadWeeklyTask() {
  const response = await fetch('ganesha_tasks_extended.json');
  const tasks = await response.json();

  const today = new Date();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  const weekKey = "ganesha_week_task";
  const completedKey = "ganesha_task_log";

  const currentWeek = `${today.getFullYear()}-W${getWeekNumber(today)}`;
  let weekData = JSON.parse(localStorage.getItem(weekKey));

  if (!weekData || weekData.week !== currentWeek) {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    weekData = {
      week: currentWeek,
      task: randomTask
    };
    localStorage.setItem(weekKey, JSON.stringify(weekData));
  }

  const task = weekData.task;
  document.getElementById("weekly-task-title").textContent = task.title;
  document.getElementById("daily-advice").textContent = task.advice[dayName] || "今日はお休み。ゆっくり過ごそう。";

  document.getElementById("completeButton").addEventListener("click", () => {
    const log = JSON.parse(localStorage.getItem(completedKey) || "[]");
    log.push({ week: currentWeek, date: today.toISOString(), task: task.title });
    localStorage.setItem(completedKey, JSON.stringify(log));
    document.getElementById("completionMessage").textContent = "達成ログを保存しました！";
    renderHistory();
  });

  document.getElementById("generateBlogButton").addEventListener("click", () => {
    const content = `今週の課題：「${task.title}」\n\n今週もこの課題を通して気づいたこと、考えたことをまとめておこう。\n\n・月曜：${task.advice["月"]}\n・火曜：${task.advice["火"]}\n・水曜：${task.advice["水"]}\n・木曜：${task.advice["木"]}\n・金曜：${task.advice["金"]}\n\nこの課題を通じて、昨日の自分よりほんの少し前に進めた気がする。`;
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
