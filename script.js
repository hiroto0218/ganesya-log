async function loadWeeklyTask() {
  const response = await fetch('ganesha_tasks_extended.json');
  const tasks = await response.json();

  const today = new Date();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];

  const weekKey = "ganesha_week_task";
  let weekData = JSON.parse(localStorage.getItem(weekKey));

  const currentWeek = `${today.getFullYear()}-W${getWeekNumber(today)}`;

  if (!weekData || weekData.week !== currentWeek) {
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    weekData = {
      week: currentWeek,
      task: randomTask
    };
    localStorage.setItem(weekKey, JSON.stringify(weekData));
  }

  document.getElementById("weekly-task-title").textContent = weekData.task.title;
  document.getElementById("daily-advice").textContent = weekData.task.advice[dayName] || "今日はお休み。ゆっくり過ごそう。";
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

window.addEventListener("DOMContentLoaded", loadWeeklyTask);
