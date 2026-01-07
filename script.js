const challenges = [
    "Hydration: Drink 1L Water now 💧",
    "Metabolic: 2000 steps in 20 mins 🏃",
    "Recovery: No screens for 1 hour 📵",
    "Focus: 5 mins deep breathing 🧘",
    "Sunshine: 10 mins outdoor light ☀️"
];

document.addEventListener("DOMContentLoaded", () => {
    updateStreak();
    generateChallenge();
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "75394226156-6gq6kjk.apps.googleusercontent.com",
            callback: () => { document.getElementById('loginOverlay').style.display = 'none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "filled_blue", size: "large" });
    }
});

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    runAnalysis({
        steps: +document.getElementById("steps").value || 0,
        sleep: +document.getElementById("sleep").value || 0,
        water: +document.getElementById("water").value || 0
    });
});

function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    const mode = document.getElementById("analysisMode").value;

    // Define Mode Targets
    let stepTarget = 8000, sleepTarget = 8, waterTarget = 3;
    if (mode === "balanced") { stepTarget = 5000; waterTarget = 2.5; }
    else if (mode === "low") { stepTarget = 3000; sleepTarget = 6; waterTarget = 2; }

    // Multivariate Weighted Algorithm
    const stepWeight = Math.min(data.steps / stepTarget, 1) * 40;
    const sleepWeight = Math.min(data.sleep / sleepTarget, 1) * 30;
    const waterWeight = Math.min(data.water / waterTarget, 1) * 30;
    const totalScore = Math.round(stepWeight + sleepWeight + waterWeight);

    loader.style.display = "block";
    insights.style.display = "none";

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status, videoId;
        if (totalScore >= 80) { status = "OPTIMIZED 🟢"; videoId = "6A7Rbl_FKMU"; }
        else if (totalScore >= 40) { status = "BALANCED 🟡"; videoId = "hBEKGBLAB80"; }
        else { status = "LOW POWER 🔴"; videoId = "ziCRIWMOjGo"; }

        document.getElementById("report").innerHTML = `
            <h2>MODE: ${mode.toUpperCase()}</h2>
            <div style="font-size: 1.1rem; border-left: 4px solid var(--blue); padding-left: 15px;">
                <p><strong>Efficiency Score:</strong> ${totalScore}%</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Diagnosis:</strong> System aligned with ${mode} protocol targets.</p>
            </div>`;

        document.getElementById("videoContainer").innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        document.getElementById("adviceContent").innerText = "Protocol suggests syncing activity with biological peak windows.";

        // Bar Rise Fix based on Mode Targets
        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min((data.steps / stepTarget) * 100, 100) + "%") : "0%";
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min((data.water / waterTarget) * 100, 100) + "%") : "0%";
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min((data.sleep / sleepTarget) * 100, 100) + "%") : "0%";
        
        updateGlobalRanking(totalScore);
    }, 1500);
}

function updateGlobalRanking(score) {
    const percentile = Math.round(score * 0.98);
    document.getElementById("percentileText").innerText = percentile + "%";
    document.getElementById("barGlobal").style.width = percentile + "%";
    document.getElementById("rankTier").innerText = percentile > 85 ? "Tier: Elite Node" : "Tier: Active Node";
}

function generateChallenge() {
    document.getElementById("challengeText").innerText = challenges[Math.floor(Math.random() * challenges.length)];
}

function shareOnSocial() {
    const task = document.getElementById("challengeText").innerText;
    const streak = localStorage.getItem("hc_streak") || 0;
    const text = `Accepted task: ${task}. Streak: ${streak} days on HealthCompass AI!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("hc_streak") || 0) + 1;
    localStorage.setItem("hc_streak", streak);
    updateStreak();
    alert("Algorithm Synced! Day Logged.");
}

function updateStreak() {
    document.getElementById("streakCount").innerText = localStorage.getItem("hc_streak") || 0;
}
