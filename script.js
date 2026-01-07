document.addEventListener("DOMContentLoaded", () => {

  /* ---------- GOOGLE SIGN-IN SAFE INIT ---------- */
  function initGoogle() {
    if (window.google && document.getElementById("googleBtn")) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_ID", // replace if needed
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
  }

  // Delay Google init to avoid race condition
  setTimeout(initGoogle, 500);

  updateStreak();

  /* ---------- FORM HANDLER ---------- */
  const form = document.getElementById("healthForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = {
        steps: Math.max(0, Number(document.getElementById("steps")?.value) || 0),
        sleep: Math.max(0, Number(document.getElementById("sleep")?.value) || 0),
        water: Math.max(0, Number(document.getElementById("water")?.value) || 0)
      };

      runAnalysis(data);
    });
  }
});

/* ---------- CORE ANALYSIS ---------- */
function runAnalysis(data) {
  const loader = document.getElementById("diagnosticLoader");
  const insights = document.getElementById("ai-insights");

  if (!loader || !insights) return;

  // Weighted score
  const score =
    Math.min(data.steps / 10000, 1) * 40 +
    Math.min(data.sleep / 8, 1) * 30 +
    Math.min(data.water / 3, 1) * 30;

  loader.style.display = "block";
  insights.style.display = "none";

  setTimeout(() => {
    loader.style.display = "none";
    insights.style.display = "grid";

    const reportDate = document.getElementById("reportDate");
    if (reportDate) reportDate.innerText = new Date().toLocaleString();

    let status, videoId, advice;

    if (score < 20) {
      status = "VERY MUCH LOW 🔴";
      videoId = "ziCRIWMOjGo";
      advice = "CRITICAL: You are in the stagnation zone. Immediate action recommended.";
    } else if (score > 80) {
      status = "OPTIMIZED 🟢";
      videoId = "6A7Rbl_FKMU";
      advice = "EXCELLENT: Peak performance achieved. Continue advanced routines.";
    } else {
      status = "BALANCED 🟡";
      videoId = "hBEKGBLAB80";
      advice = "STABLE: Maintain hydration and consistent rest cycles.";
    }

    const report = document.getElementById("report");
    if (report) {
      report.innerHTML = `
        <h2 style="color:${score < 20 ? "#ff2e63" : "#0ea5e9"}">
          STATUS: ${status}
        </h2>
        <p><strong>Steps:</strong> ${data.steps} / 10,000</p>
        <p><strong>Sleep:</strong> ${data.sleep} Hours</p>
        <p><strong>Water:</strong> ${data.water} Liters</p>
        <hr>
        <p><strong>Overall AI Score:</strong> ${Math.round(score)}%</p>
      `;
    }

    const video = document.getElementById("videoContainer");
    if (video) {
      video.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}"
          allowfullscreen
          loading="lazy">
        </iframe>
      `;
    }

    const adviceBox = document.getElementById("adviceContent");
    if (adviceBox) adviceBox.innerText = advice;

    // Progress bars
    setBar("barSteps", Math.min(data.steps / 100, 100));
    setBar("barWater", Math.min((data.water / 3) * 100, 100));
    setBar("barSleep", Math.min((data.sleep / 8) * 100, 100));

  }, 1500);
}

/* ---------- HELPERS ---------- */
function setBar(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = value > 0 ? value + "%" : "0%";
}

function printReport() {
  window.print();
}

function saveDailyData() {
  const streak = Number(localStorage.getItem("hc_streak") || 0) + 1;
  localStorage.setItem("hc_streak", streak);
  updateStreak();
  alert("Data Synced! Streak Updated.");
}

function updateStreak() {
  const el = document.getElementById("streakCount");
  if (el) el.innerText = localStorage.getItem("hc_streak") || 0;
}
