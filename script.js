let userData = {};

// Startup
document.addEventListener("DOMContentLoaded", () => {
    updateStreakDisplay();
    if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
});

function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function scrollToDashboard() {
    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
}

// Data Processing
document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    userData = {
        steps: +document.getElementById("steps").value,
        sleep: +document.getElementById("sleep").value,
        water: +document.getElementById("water").value,
        mood: document.getElementById("mood").value
    };
    generateReport(userData);
});

function generateReport(data) {
    document.getElementById("ai-insights").style.display = "grid";
    let status = "SYSTEM: BALANCED 🟡";
    let videoId = "hBEKGBLAB80"; // Ali Abdaal - 8 Hacks
    let advice = "Analyzing biometric data... Optimizing with Ali Abdaal's protocol.";

    if (data.steps >= 8000 && data.sleep >= 7 && data.water >= 2.5) {
        status = "SYSTEM: OPTIMIZED 🟢";
        videoId = "mTMfiv-zeuE";
        advice = "Peak performance detected. Logic: Maintain current cadence.";
    }

    document.getElementById("report").innerHTML = `
        <h3 style="color:var(--tech-blue)">${status}</h3>
        <p>> STEPS: ${data.steps}</p>
        <p>> SLEEP: ${data.sleep}h</p>
        <p>> WATER: ${data.water}L</p>
    `;
    
    document.getElementById("adviceContent").innerText = advice;
    document.getElementById("videoContainer").innerHTML = `
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" allowfullscreen></iframe>`;

    updateUI(data);
}

function updateUI(data) {
    document.getElementById("barSteps").style.width = Math.min((data.steps / 10000) * 100, 100) + "%";
    document.getElementById("barWater").style.width = Math.min((data.water / 3) * 100, 100) + "%";
    
    const score = Math.round((Math.min(data.steps/10000,1)*40) + (Math.min(data.sleep/8,1)*30) + (Math.min(data.water/3,1)*30));
    document.getElementById("userScoreBar").style.width = score + "%";
    document.getElementById("globalRank").innerText = score > 80 ? "#125 (Top 5% Network)" : "#12,890 (Top 40%)";
}

// Challenges & Streaks
function generateChallenge() {
    const tasks = ["DO 20 SQUATS", "DRINK 500ML WATER", "DEEP BREATHING 2MIN"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random()*tasks.length)];
    document.getElementById("challengeDisplay").style.display = "block";
}

function shareChallenge() {
    const msg = `Protocol: ${document.getElementById("challengeText").innerText}. Join HealthCompass AI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

function saveDailyData() {
    const today = new Date().toLocaleDateString();
    let streak = parseInt(localStorage.getItem("healthStreak")) || 0;
    streak++;
    localStorage.setItem("healthStreak", streak);
    localStorage.setItem("lastEntryDate", today);
    updateStreakDisplay();
    alert("System Synced. Streak Logged! 🔥");
}

function updateStreakDisplay() {
    document.getElementById("streakCount").innerText = localStorage.getItem("healthStreak") || 0;
}

function exportToDoctor() {
    const w = window.open();
    w.document.write(`<h1>HealthCompass System Log</h1><hr>${document.getElementById("report").innerHTML}`);
    w.print();
}
