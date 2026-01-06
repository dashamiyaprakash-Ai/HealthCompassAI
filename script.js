// Global State
let healthData = { steps: 0, sleep: 0, water: 0, mood: 'Low' };

document.addEventListener("DOMContentLoaded", () => {
    // 1. Safe Google Auth Initialization
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
            callback: (response) => {
                document.getElementById('loginOverlay').style.display = 'none';
            }
        });
        google.accounts.id.renderButton(
            document.getElementById("googleBtn"), 
            { theme: "outline", size: "large", width: "100%" }
        );
    }
    updateStreakDisplay();
});

// 2. Theme Toggle with Icon Fix
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById("themeIcon");
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        icon.className = "fas fa-sun";
    } else {
        icon.className = "fas fa-moon";
    }
}

// 3. Main Analysis Logic
document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Capture Inputs [cite: 13, 14]
    healthData.steps = parseInt(document.getElementById("steps").value) || 0;
    healthData.sleep = parseInt(document.getElementById("sleep").value) || 0;
    healthData.water = parseFloat(document.getElementById("water").value) || 0;
    healthData.mood = document.getElementById("mood").value;

    executeDiagnostic();
});

function executeDiagnostic() {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    
    // Calculate Score (Weightage: Steps 40%, Sleep 30%, Water 30%)
    const score = (Math.min(healthData.steps/10000, 1) * 40) + 
                  (Math.min(healthData.sleep/8, 1) * 30) + 
                  (Math.min(healthData.water/3, 1) * 30);

    // WINNING LOGIC: Identify "Very Much Low" or Critical Imbalance
    const isCritical = (healthData.steps === 0 && healthData.sleep === 0 && healthData.water === 0) || (score < 15);

    // UI State Management 
    insights.style.display = "none";
    loader.style.display = "block";
    
    if (isCritical) {
        loader.classList.add("reboot-mode");
        loader.querySelector(".terminal-text").innerText = "SYSTEM CRITICAL: REBOOTING...";
    } else {
        loader.classList.remove("reboot-mode");
        loader.querySelector(".terminal-text").innerText = "SCANNING BIOMETRICS...";
    }

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        displayResults(score, isCritical);
    }, 2500);
}

function displayResults(score, isCritical) {
    const report = document.getElementById("report");
    const video = document.getElementById("videoContainer");
    const advice = document.getElementById("adviceContent");

    // Dynamic Content Based on Score [cite: 10, 11]
    let status = "STATUS: BALANCED 🟡";
    let videoId = "hBEKGBLAB80"; // General hacks
    let adviceText = "System operational. Minor hydration adjustments suggested.";

    if (isCritical) {
        status = "STATUS: VERY MUCH LOW 🔴";
        videoId = "6_vOInS_A8c"; // Survival/Rest protocol
        adviceText = "CRITICAL FAILURE: No movement or hydration detected. System stagnation imminent.";
    } else if (score > 80 && healthData.mood === "Good") {
        status = "STATUS: OPTIMIZED 🟢";
        videoId = "mTMfiv-zeuE"; // High performance protocol
        adviceText = "Peak performance achieved. Sustainability logic active.";
    }

    // Update Report UI [cite: 10]
    report.innerHTML = `
        <h3 style="color:${isCritical ? '#ff2e63' : 'var(--tech-blue)'}">${status}</h3>
        <p>> DATA_SYNC: SUCCESS</p>
        <p>> OPTIMIZATION_SCORE: ${Math.round(score)}%</p>
    `;

    advice.innerText = adviceText;
    video.innerHTML = `<iframe width="100%" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

    // Progress Bar Animation (No rise if zero) 
    document.getElementById("barSteps").style.width = (isCritical || healthData.steps === 0) ? "2%" : `${(healthData.steps/10000)*100}%`;
    document.getElementById("barWater").style.width = (isCritical || healthData.water === 0) ? "2%" : `${(healthData.water/3)*100}%`;
    document.getElementById("userScoreBar").style.width = `${Math.max(score, 5)}%`;
}

function generateChallenge() {
    const tasks = ["Drink 1L Water", "20 Pushups", "10 Min Meditation"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random()*tasks.length)];
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("healthStreak") || 0) + 1;
    localStorage.setItem("healthStreak", streak);
    updateStreakDisplay();
    alert("Biometric Data Synced to Cloud! 🔥");
}

function updateStreakDisplay() {
    document.getElementById("streakCount").innerText = localStorage.getItem("healthStreak") || 0;
}
