document.addEventListener("DOMContentLoaded", () => {
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_ID",
            callback: () => { document.getElementById('loginOverlay').style.display='none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "filled_blue", size: "large" });
    }
    updateStreak();
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
    
    // Step logic: Optimal zone is 7000-8000
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
            videoId = "ziCRIWMOjGo"; // Motivational
            advice = "System Stagnation detected. Movement is critical.";
        } else if (data.steps >= 7000 && totalScore > 75) {
            status = "OPTIMIZED 🟢";
            videoId = "6A7Rbl_FKMU"; // Brain Exercises
            advice = "Peak Biological Window reached. Maximize cognitive load.";
        } else {
            status = "BALANCED 🟡";
            videoId = "hBEKGBLAB80"; // Default
            advice = "System stable. Target 7,000+ steps for Optimization.";
        }

        document.getElementById("report").innerHTML = `
            <h2>STATUS: ${status}</h2>
            <p><strong>Steps:</strong> ${data.steps} / 8,000</p>
            <p><strong>Hydration:</strong> ${data.water} L / 3.0</p>
            <p><strong>AI Efficiency Score:</strong> ${totalScore}%</p>`;

        document.getElementById("videoContainer").innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        document.getElementById("adviceContent").innerText = advice;

        // Bar Rise Fix
        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min(data.steps/80, 100) + "%") : "0%";
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min(data.water/3*100, 100) + "%") : "0%";
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min(data.sleep/8*100, 100) + "%") : "0%";
        
        updateGlobalRanking(totalScore);
    }, 1500);
}

function updateGlobalRanking(score) {
    const percentile = Math.round(score * 0.99);
    document.getElementById("percentileText").innerText = percentile + "%";
    document.getElementById("barGlobal").style.width = percentile + "%";
    const tier = document.getElementById("rankTier");
    if (percentile >= 95) tier.innerHTML = "Tier: <span style='color:gold'>Elite Legend</span>";
    else if (percentile >= 75) tier.innerText = "Tier: Master Pro";
    else tier.innerText = "Tier: Active Node";
}

function generateChallenge() {
    const tasks = ["Drink 1L Water now 💧", "10,000 steps today 🏃", "No caffeine for 4h ☕"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random() * tasks.length)];
}

function shareChallenge() {
    const task = document.getElementById("challengeText").innerText;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Accepted my HealthCompass AI task: " + task)}`);
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("hc_streak") || 0) + 1;
    localStorage.setItem("hc_streak", streak);
    updateStreak();
    alert("Biometrics Synced!");
}

function updateStreak() { document.getElementById("streakCount").innerText = localStorage.getItem("hc_streak") || 0; }
