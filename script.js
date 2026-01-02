let userData = {};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
});

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function scrollToDashboard() {
  document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("healthForm").addEventListener("submit", e => {
  e.preventDefault();

  userData = {
    steps: +steps.value,
    sleep: +sleep.value,
    water: +water.value,
    mood: mood.value
  };

  generateReport(userData);
});

function generateReport(data) {
  let status = "Average Health 🟡";
  let reasons = [];

  if (data.steps >= 8000 && data.sleep >= 7 && data.sleep <= 9 && data.water >= 2.5 && data.mood === "Good") {
    status = "Good Health 🟢";
    reasons = ["Active lifestyle", "Good sleep", "Proper hydration", "Positive mood"];
  } else if (data.steps < 4000 || data.sleep < 6 || data.water < 1.5) {
    status = "Low Health 🔴";
    if (data.steps < 4000) reasons.push("Low steps");
    if (data.sleep < 6) reasons.push("Poor sleep");
    if (data.water < 1.5) reasons.push("Low hydration");
  } else {
    reasons = ["Moderate activity", "Needs improvement"];
  }

  report.innerHTML = `
    <h3>Your Health Report</h3>
    <p>Steps: ${data.steps}</p>
    <p>Sleep: ${data.sleep} hrs</p>
    <p>Water: ${data.water} L</p>
    <p>Mood: ${data.mood}</p>
    <h2>${status}</h2>
    <ul>${reasons.map(r => `<li>${r}</li>`).join("")}</ul>
  `;

  drawChart(data);
}

function drawChart(data) {
  const c = document.getElementById("healthChart");
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  const vals = [data.steps/100, data.sleep*15, data.water*30];
  const labels = ["Steps","Sleep","Water"];

  vals.forEach((v,i)=>{
    ctx.fillStyle="#0a6cf1";
    ctx.fillRect(60+i*80,180-v,40,v);
    ctx.fillStyle="#000";
    ctx.fillText(labels[i],60+i*80,195);
  });
}

function saveDailyData() {
  let history = JSON.parse(localStorage.getItem("healthHistory")) || [];
  history.push({ date: new Date().toLocaleDateString(), ...userData });
  localStorage.setItem("healthHistory", JSON.stringify(history));
  alert("Saved!");
}

function showTrends() {
  let history = JSON.parse(localStorage.getItem("healthHistory")) || [];
  if (!history.length) return alert("No data");

  report.innerHTML += "<h3>Weekly Trend</h3>" +
    history.slice(-7).map(h =>
      `<p>${h.date}: Steps ${h.steps}, Sleep ${h.sleep}, Water ${h.water}</p>`
    ).join("");
}

function downloadPDF() {
  if (!report.innerHTML) return alert("Generate report first");
  const w = window.open("");
  w.document.write(`<h1>Health Report</h1>${report.innerHTML}`);
  w.print();
}

async function askAI() {
  const q = userQuestion.value;
  const key = apiKey.value;
  if (!q || !key) return alert("Enter question and API key");

  chat.innerHTML += `<p><b>You:</b> ${q}</p>`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${key}`
    },
    body:JSON.stringify({
      model:"gpt-3.5-turbo",
      messages:[{role:"user",content:q}]
    })
  });

  const data = await res.json();
  chat.innerHTML += `<p><b>AI:</b> ${data.choices[0].message.content}</p>`;
  userQuestion.value="";
}

function startVoice() {
  if (!("webkitSpeechRecognition" in window)) return alert("Not supported");
  const r = new webkitSpeechRecognition();
  r.lang="en-US";
  r.start();
  r.onresult=e=>{
    userQuestion.value=e.results[0][0].transcript;
    askAI();
  };
}
