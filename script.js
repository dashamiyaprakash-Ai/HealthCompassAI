document.addEventListener("DOMContentLoaded", () => {

  /* ---------- GOOGLE SIGN-IN SAFE ---------- */
  if (window.google && document.getElementById("googleBtn")) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_ID",
      callback: () => {
        const overlay = document.getElementById("loginOverlay");
        if (overlay) overlay.style.display = "none";
      }
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "filled_blue", size: "large" }
    );
  }

  updateStreak();

  /* ---------- FORM HANDLER SAFE ---------- */
  const form = document.getElementById("healthForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      runAnalysis({
        steps: +document.getElementById("steps")?.value || 0,
        sleep: +document.getElementById("sleep")?.value || 0,
        water: +document.getElementById("water")?.value || 0
      });
    });
  }
});

/* ---------- CORE LOGIC ---------- */
function runAnalysis(data) {
  const loader = document.getElementById("diagnosticLoader");
  const insights = document.getElementById("ai-insights");

  const stepScore = Math.min(data.steps / 8000, 1) * 40;
  const sleepScore = Math.min(data.sleep / 8, 1) * 30;
  const waterScore = Math.min(data.water / 3, 1) * 30;
  const totalScore = Math.round(stepScore + sleepScore + waterScore);

  if (loader) loader.style.display = "block";
  if (insights) insights.style.display = "none";

  setTimeout(() => {
    if (loader) loader.style.display = "none";
    if (insights) insights.style.display = "grid";

    let status, videoId, advice;

    if (totalScore < 20) {
      status = "VERY MUCH LOW 🔴";
      videoId = "ziCRIWMOjGo";
      advice = "System stagnation detected. Immediate movement recommended.";
    } else if (totalScore >= 75 && data.steps >= 7000) {
      status = "OPTIMIZED 🟢";
      videoId = "6A7Rbl_FKMU";
      advice = "Peak biological performance detected.";
    } else {
      status = "BALANCED 🟡";
      videoId = "hBEKGBLAB80";
      advice = "System stable. Maintain consistency.";
    }

    document.getElementById("report").innerHTML = `
      <h2>Status: ${status}</h2>
      <p><strong>Steps:</strong> ${data.steps}</p>
      <p><strong>Sleep:</strong> ${data.sleep} h</p>
      <p><strong>Water:</strong> ${data.water} L</p>
      <p><strong>AI Score:</strong> ${totalScore}%</p>
    `;

    document.getElementById("videoContainer").innerHTML =
      `<iframe loading="lazy" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;

    document.getElementById("adviceContent").innerText = advice;

    setBar("barSteps", Math.min(data.steps / 80, 100));
    setBar("barSleep", Math.min(data.sleep / 8 * 100, 100));
    setBar("barWater", Math.min(data.water / 3 * 100, 100));

    updateGlobalRanking(totalScore);
  }, 1200);
}

/* ---------- HELPERS ---------- */
function setBar(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = value + "%";
}

function updateGlobalRanking(score) {
  const percentile = Math.round(score * 0.99);
  document.getElementById("percentileText").innerText = percentile + "%";
  setBar("barGlobal", percentile);

  const tier = document.getElementById("rankTier");
  if (percentile >= 95) tier.innerHTML = "Tier: <b style='color:gold'>Elite</b>";
  else if (percentile >= 75) tier.innerText = "Tier: Master";
  else tier.innerText = "Tier: Active";
}

function generateChallenge() {
  const tasks = [
    "Drink 1L water 💧",
    "7,000 steps today 🚶",
    "Sleep 8 hours 😴"
  ];
  document.getElementById("challengeText").innerText =
    tasks[Math.floor(Math.random() * tasks.length)];
}

function shareChallenge() {
  const text = document.getElementById("challengeText").innerText;
  window.open(
    "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent("My HealthCompass AI task: " + text)
  );
}

function saveDailyData() {
  let streak = Number(localStorage.getItem("hc_streak") || 0) + 1;
  localStorage.setItem("hc_streak", streak);
  updateStreak();
  alert("Saved successfully!");
}

function updateStreak() {
  document.getElementById("streakCount").innerText =
    localStorage.getItem("hc_streak") || 0;
}
