document.addEventListener("DOMContentLoaded", async function () {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const today = new Date();
  const day = weekdays[today.getDay()];
  const res = await fetch("ganesha_tasks_extended.json");
  const tasks = await res.json();
  const task = tasks[Math.floor(Math.random() * tasks.length)];

  const weeklyTitle = document.getElementById("weekly-task-title");
  const taskIntention = document.getElementById("task-intention");
  const taskEffect = document.getElementById("task-effect");
  const dailyAdvice = document.getElementById("daily-advice");

  weeklyTitle.textContent = task.title;
  taskIntention.textContent = task.intention || "（意図なし）";
  taskEffect.textContent = task.effect || "（変化なし）";
  dailyAdvice.textContent = task.advice[day] || "今日はお休みです。";

  document.getElementById("generateBlogButton").addEventListener("click", () => {
    const memo = document.getElementById("dailyMemo").value;
    const template = `【今週の課題】\n${task.title}\n
【なぜこの課題？】\n${task.intention}\n
【この課題をやり遂げると？】\n${task.effect}\n
【今日のアドバイス】\n${task.advice[day]}\n
【今日の実行メモ】\n${memo || "（まだ書いていません）"}`;

    document.getElementById("blogTemplate").value = template;
    document.getElementById("copyStatus").textContent = "";
  });

  document.getElementById("copyBlogBtn").addEventListener("click", () => {
    const template = document.getElementById("blogTemplate");
    template.select();
    document.execCommand("copy");
    document.getElementById("copyStatus").textContent = "コピーしました！";
  });
});