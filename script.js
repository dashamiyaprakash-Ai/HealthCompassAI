document.addEventListener("DOMContentLoaded", () => {

    /* ---------- GOOGLE LOGIN (SAFE) ---------- */
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

    /* ---------- FORM SUBMIT ---------- */
    const healthForm = document.getElementById("healthForm");
    if (healthForm) {
        healthForm.addEventListener("submit", (e) => {
            e.preventDefault();

            runAnalysis({
                steps: +document.getElementById("steps")?.value || 0,
                sleep: +document.getElementById("sleep")?.value || 0,
                water: +document.getElementById("water")?.value || 0
            });
        });
    }
});

/* ---------- MAIN ANALYSIS ---------- */
function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");

    const stepWeight = Math.min(data.steps / 8000, 1) * 40;
    const sleepWeight = Math.min(data.sleep / 8, 1) * 30;
    const waterWeight = Math.min(data.water / 3, 1) * 30;
    const totalScore = Math.round(stepWeight + sleepWeight + waterWeight);

    if (loader) loader.style.display = "block";
    if (insights) insights.style.display = "none";

    setTimeout(() => {
        if (loader) loader.style.display = "none";
        if (insights) insights.style.display = "grid";

        let status, videoId, advice;

        if (totalScore < 20) {
            status = "VERY MUCH LOW 🔴";
            videoId = "ziCRIWMOjGo";
            advice = "System stagnation detected. Increase movement.";
        } else if (data.steps >= 7000 && totalScore > 75) {
            status = "OPTIMIZED 🟢";
            videoId = "6A7Rbl_FKMU";
            advice = "Peak biological window reached.";
        } else {
            status = "BALANCED 🟡";
            videoId = "hBEKGBLAB80";
            advice = "System stable. Push toward 7,000+ steps.";
        }

        const report = document.getElementById("report");
        if (report) {
            report.innerHTML = `
                <h2>STATUS: ${status}</h2>
                <p><strong>Steps:</strong> ${data.steps} / 8,000</p>
                <p><strong>Hydration:</strong> ${data.water} L / 3.0</p>
                <p><strong>Sleep:</strong> ${data.sleep} / 8 hrs</p>
                <p><strong>AI Efficiency Score:</strong> ${totalScore}%</p>
            `;
        }

        const video = document.getElementById("videoContainer");
        if (video) {
            video.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}"
                frameborder="0" allowfullscreen></iframe>
            `;
        }

        const adviceBox = document.getElementById("adviceContent");
        if (adviceBox) adviceBox.innerText = advice;

        setBar("barSteps", Math.min(data.steps / 80, 100));
        setBar("barWater", Math.min((data.water / 3) * 100, 100));
        setBar("barSleep", Math.min((data.sleep / 8) * 100, 100));

        updateGlobalRanking(totalScore);
    }, 1200);
}

/* ---------- HELPERS ---------- */
function setBar(id, value) {
    const bar = document.getElementById(id);
    if (bar) bar.style.width = value + "%";
}

function updateGlobalRanking(score) {
    const percentile = Math.round(score * 0.99);

    const pctText = document.getElementById("percentileText");
    if (pctText) pctText.innerText = percentile + "%";

    setBar("barGlobal", percentile);

    const tier = document.getElementById("rankTier");
    if (!tier) return;

    if (percentile >= 95) {
        tier.innerHTML = "Tier: <span style='color:gold'>Elite Legend</span>";
    } else if (percentile >= 75) {
        tier.innerText = "Tier: Master Pro";
    } else {
        tier.innerText = "Tier: Active Node";
    }
}

function generateChallenge() {
    const tasks = [
        "Drink 1L Water now 💧",
        "10,000 steps today 🏃",
        "No caffeine for 4h ☕"
    ];
    const el = document.getElementById("challengeText");
    if (el) el.innerText = tasks[Math.floor(Math.random() * tasks.length)];
}

function shareChallenge() {
    const task = document.getElementById("challengeText")?.innerText;
    if (!task) return;

    window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            "Accepted my HealthCompass AI task: " + task
        )}`
    );
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("hc_streak") || "0", 10) + 1;
    localStorage.setItem("hc_streak", streak);
    updateStreak();
    alert("Biometrics Synced!");
}

function updateStreak() {
    const el = document.getElementById("streakCount");
    if (el) el.innerText = localStorage.getItem("hc_streak") || "0";
}
