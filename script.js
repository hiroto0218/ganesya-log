
document.addEventListener("DOMContentLoaded", async function () {
  const weekKey = "ganesha_week_task";
  const memoKey = "ganesha_task_memo";
  const completedKey = "ganesha_task_log";
  const weekDoneKey = "ganesha_week_done";

  const today = new Date();
  const currentWeek = `${today.getFullYear()}-W${getWeekNumber(today)}`;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const todayName = weekdays[today.getDay()];

  try {
    const response = await fetch("ganesha_tasks_extended.json");
    if (!response.ok) throw new Error("データ読み込み失敗");
    const tasks = await response.json();

    let weekData = JSON.parse(localStorage.getItem(weekKey));
    if (!weekData || weekData.week !== currentWeek) {
      const newTask = tasks[Math.floor(Math.random() * tasks.length)];
      weekData = { week: currentWeek, task: newTask };
      localStorage.setItem(weekKey, JSON.stringify(weekData));
    }

    const task = weekData.task;
    document.getElementById("weekly-task-title").textContent = task.title;
    document.getElementById("daily-advice").textContent = task.advice[todayName] || "今日はお休み。";

    const memoData = JSON.parse(localStorage.getItem(memoKey) || "{}");
    const memoField = document.getElementById("dailyMemo");
    memoField.value = memoData[todayName] || "";
    if (memoField.value) {
      document.getElementById("memoSavedMsg").textContent = `【${todayName}曜のメモ】保存済み。いつでも訂正できます。`;
    }

    document.getElementById("memoHint").innerHTML = `
      <strong>書くヒント：</strong>
      <ul>
        <li>どんな感情があった？（嬉しい・面倒・誇らしい）</li>
        <li>何をした？どんな事実があった？</li>
        <li>やってどう思った？次はどうしたい？</li>
      </ul>
    `;

    document.getElementById("saveMemoBtn").addEventListener("click", () => {
      memoData[todayName] = memoField.value;
      localStorage.setItem(memoKey, JSON.stringify(memoData));
      document.getElementById("memoSavedMsg").textContent = `【${todayName}曜のメモ】保存しました！再編集も可能です。`;
    });

    document.getElementById("completeButton").addEventListener("click", () => {
      const log = JSON.parse(localStorage.getItem(completedKey) || "[]");
      log.push({ week: currentWeek, date: today.toISOString(), task: task.title });
      localStorage.setItem(completedKey, JSON.stringify(log));
      document.getElementById("completionMessage").textContent = "達成ログを保存しました！";
      renderHistory();
    });

    const weekDone = JSON.parse(localStorage.getItem(weekDoneKey) || "{}");
    if (weekDone[currentWeek]) {
      document.getElementById("weeklyDoneStatus").textContent = "この課題は達成済みです！お疲れさま！";
    }
    document.getElementById("weeklyDoneButton").addEventListener("click", () => {
      weekDone[currentWeek] = true;
      localStorage.setItem(weekDoneKey, JSON.stringify(weekDone));
      document.getElementById("weeklyDoneStatus").textContent = "この課題は達成済みです！お疲れさま！";
    });

    document.getElementById("generateBlogButton").addEventListener("click", () => {
      const memo = JSON.parse(localStorage.getItem(memoKey) || "{}");
      const lines = Object.keys(task.advice).map(day =>
        `・${day}曜：${task.advice[day]}${memo[day] ? " → 実行メモ：" + memo[day] : ""}`
      ).join("\n");

      const content = `今週の課題：「${task.title}」\n\n今週を振り返って、自分の感情・行動・気づきを整理してみよう。\n\n${lines}\n\nこの課題を通じて得たことや、昨日の自分との差を言葉にしてみよう。`;
      document.getElementById("blogTemplate").value = content;
    });

    document.getElementById("copyBlogBtn").addEventListener("click", () => {
      const textarea = document.getElementById("blogTemplate");
      textarea.select();
      document.execCommand("copy");
      document.getElementById("copyStatus").textContent = "コピーしました！";
    });

    renderHistory();
  } catch (err) {
    document.getElementById("weekly-task-title").textContent = "課題の読み込みに失敗しました。";
    console.error("読み込みエラー:", err);
  }

  function renderHistory() {
    const log = JSON.parse(localStorage.getItem(completedKey) || "[]");
    const historyArea = document.getElementById("historyArea");
    historyArea.innerHTML = "";
    if (!log.length) {
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

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }
});
