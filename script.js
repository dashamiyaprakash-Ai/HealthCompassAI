document.addEventListener("DOMContentLoaded", () => {
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_ID",
            callback: () => { document.getElementById('loginOverlay').style.display='none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "outline" });
    }
    updateStreakDisplay();
});

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        steps: +document.getElementById("steps").value,
        sleep: +document.getElementById("sleep").value,
        water: +document.getElementById("water").value,
        mood: document.getElementById("mood").value
    };
    runDiagnostic(data);
});

function runDiagnostic(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    const score = (Math.min(data.steps/10000, 1)*40) + (Math.min(data.sleep/8, 1)*30) + (Math.min(data.water/3, 1)*30);
    const isCritical = (data.steps === 0 && data.sleep === 0 && data.water === 0);

    loader.style.display = "block";
    insights.style.display = "none";
    if (isCritical) loader.classList.add("reboot-mode");

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status = isCritical ? "STATUS: VERY MUCH LOW 🔴" : "STATUS: BALANCED 🟡";
        let videoId = isCritical ? "6_vOInS_A8c" : "hBEKGBLAB80";
        if (score > 80) status = "STATUS: OPTIMIZED 🟢";

        document.getElementById("report").innerHTML = `<h3 style="color:${isCritical ? '#ff2e63' : '#0ea5e9'}">${status}</h3><p>> SCORE: ${Math.round(score)}%</p>`;
        document.getElementById("videoContainer").innerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0"></iframe>`;
        document.getElementById("adviceContent").innerText = isCritical ? "System Stagnation. Immediate hydration required." : "Metrics synced. Keep moving.";

        // Bar Rise Logic: Only rise if value > 0
        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min(data.steps/100, 100) + "%") : "0%";
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min(data.water/3*100, 100) + "%") : "0%";
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min(data.sleep/8*100, 100) + "%") : "0%";
        document.getElementById("userScoreBar").style.width = score + "%";
        document.getElementById("globalRank").innerText = score > 80 ? "RANK: #125 (Top 5%)" : "RANK: #12,890 (Top 40%)";
    }, 1500);
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("streak") || 0) + 1;
    localStorage.setItem("streak", streak);
    updateStreakDisplay();
    alert("Data Synced! Streak Updated.");
}

function updateStreakDisplay() {
    document.getElementById("streakCount").innerText = localStorage.getItem("streak") || 0;
}

function generateChallenge() {
    const tasks = ["Drink 1L Water", "Walk 2000 steps now", "5 min meditation"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random()*tasks.length)];
}

function exportToPDF() { window.print(); }

function shareProgress() {
    const text = `I'm at ${document.getElementById("streakCount").innerText} day streak on HealthCompass AI!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
}

function toggleTheme() { document.body.classList.toggle("dark"); }
