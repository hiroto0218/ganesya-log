document.addEventListener("DOMContentLoaded", async function () {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const today = new Date();
  const day = weekdays[today.getDay()];
  const res = await fetch("ganesha_tasks_extended.json");
  const tasks = await res.json();
  const task = tasks[Math.floor(Math.random() * tasks.length)];

  document.getElementById("weekly-task-title").textContent = task.title;
  document.getElementById("task-intention").textContent = task.intention || "（意図なし）";
  document.getElementById("task-effect").textContent = task.effect || "（変化なし）";
  document.getElementById("daily-advice").textContent = task.advice[day] || "今日はお休みです。";
});