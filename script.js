document.addEventListener("DOMContentLoaded", () => {
    updateStreak();
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_ID",
            callback: () => { document.getElementById('loginOverlay').style.display='none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "filled_blue", size: "large" });
    }
});

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        steps: +document.getElementById("steps").value || 0,
        sleep: +document.getElementById("sleep").value || 0,
        water: +document.getElementById("water").value || 0
    };
    runAnalysis(data);
});

function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    
    // ALGORITHM: Weighted Mode Calculation
    const stepWeight = Math.min(data.steps / 8000, 1) * 40;
    const sleepWeight = Math.min(data.sleep / 8, 1) * 30;
    const waterWeight = Math.min(data.water / 3, 1) * 30;
    const totalScore = Math.round(stepWeight + sleepWeight + waterWeight);

    loader.style.display = "block";
    insights.style.display = "none";

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status, videoId, advice;

        if (totalScore < 20) {
            status = "VERY MUCH LOW 🔴";
            videoId = "ziCRIWMOjGo"; 
            advice = "Diagnostic Alert: System Stagnation. Immediate physical activity required.";
        } else if (data.steps >= 7000 && totalScore > 75) {
            status = "OPTIMIZED 🟢";
            videoId = "6A7Rbl_FKMU";
            advice = "Diagnostic Verified: Peak Performance Window reached.";
        } else {
            status = "BALANCED 🟡";
            videoId = "hBEKGBLAB80";
            advice = "Diagnostic Update: System Stable.";
        }

        document.getElementById("report").innerHTML = `
            <h2>MODE TYPE: ${totalScore}% Efficiency</h2>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Metrics:</strong> ${data.steps} Steps | ${data.sleep}h Sleep | ${data.water}L Water</p>`;

        document.getElementById("videoContainer").innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        document.getElementById("adviceContent").innerText = advice;

        // FIXED BAR LOGIC: Ensures rise only when value > 0
        // Steps Bar (Target 8000)
        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min((data.steps / 8000) * 100, 100) + "%") : "0%";
        
        // Hydration Bar (Target 3L)
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min((data.water / 3) * 100, 100) + "%") : "0%";
        
        // Sleep Bar (Target 8h)
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min((data.sleep / 8) * 100, 100) + "%") : "0%";
        
        updateGlobalRanking(totalScore);
    }, 1500);
}

function updateGlobalRanking(score) {
    const percentile = Math.round(score * 0.99);
    document.getElementById("percentileText").innerText = percentile + "%";
    document.getElementById("barGlobal").style.width = percentile + "%";
    const tier = document.getElementById("rankTier");
    if (percentile >= 95) tier.innerHTML = "Tier: <span style='color:gold'>Elite Node</span>";
    else if (percentile >= 75) tier.innerText = "Tier: Master Node";
    else tier.innerText = "Tier: Active Participant";
}

function generateChallenge() {
    const tasks = ["Drink 1L Water now 💧", "Walk 2000 steps 🏃", "Meditate 5 mins 🧘"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random() * tasks.length)];
}

function shareChallenge() {
    const task = document.getElementById("challengeText").innerText;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("My HealthCompass Task: " + task)}`);
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("hc_streak") || 0) + 1;
    localStorage.setItem("hc_streak", streak);
    updateStreak();
    alert("Algorithm Synced!");
}

function updateStreak() { 
    document.getElementById("streakCount").innerText = localStorage.getItem("hc_streak") || 0; 
}
