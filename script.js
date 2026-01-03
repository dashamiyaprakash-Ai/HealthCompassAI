/**
 * HealthCompass AI - Core Engine
 * 2026 Hackathon Edition
 */

let userData = {};

// Initialize application on DOM load
document.addEventListener("DOMContentLoaded", () => {
    // Restore theme preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
    
    // Initial display updates
    updateStreakDisplay();
    setupSmartReminders();
});

/**
 * Theme Management
 */
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function scrollToDashboard() {
    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
}

/**
 * Health Report Generation & Logic
 */
document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Capture user inputs
    userData = {
        steps: +document.getElementById("steps").value,
        sleep: +document.getElementById("sleep").value,
        water: +document.getElementById("water").value,
        mood: document.getElementById("mood").value
    };

    generateReport(userData);
});

function generateReport(data) {
    const reportContainer = document.getElementById("reportContainer");
    reportContainer.style.display = "grid";

    let status = "System Status: Balanced 🟡";
    let videoId = "hBEKGBLAB80"; // Requested: Ali Abdaal - 8 Simple Hacks to Improve Your Health
    let advice = "Vitals are within nominal range. Executing Ali Abdaal's 8-hack optimization protocol.";

    // Logic for Excellent Health Status
    if (data.steps >= 8000 && data.sleep >= 7 && data.water >= 2.5 && data.mood === "Good") {
        status = "System Status: Optimized 🟢";
        videoId = "mTMfiv-zeuE"; // High-performance content
        advice = "Peak performance detected. Core metrics exceed global averages.";
    } 
    // Logic for Low Health Status
    else if (data.steps < 4000 || data.sleep < 6 || data.water < 1.5) {
        status = "System Status: Critical 🔴";
        advice = "Low power detected. Immediate intervention required using optimization hacks.";
    }

    // Update UI elements
    document.getElementById("report").innerHTML = `
        <h3 class="terminal-text">${status}</h3>
        <p>> STEPS_COUNT: ${data.steps}</p>
        <p>> SLEEP_CYCLES: ${data.sleep}h</p>
        <p>> HYDRATION_LEVEL: ${data.water}L</p>
        <p>> EMOTIONAL_SYNC: ${data.mood}</p>
    `;

    document.getElementById("adviceContent").innerText = advice;
    
    // Inject Video Feed
    document.getElementById("videoContainer").innerHTML = `
        <iframe width="100%" height="215" 
            src="https://www.youtube.com/embed/${videoId}" 
            title="Health Optimization Feed" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;

    updateProgress(data);
    calculateGlobalStanding(data);
}

/**
 * Progress & Leaderboard Algorithms
 */
function updateProgress(data) {
    // Calculate percentages based on standard tech goals
    const stepGoal = 10000;
    const waterGoal = 3.0;

    const stepPerc = Math.min((data.steps / stepGoal) * 100, 100);
    const waterPerc = Math.min((data.water / waterGoal) * 100, 100);

    document.getElementById("barSteps").style.width = stepPerc + "%";
    document.getElementById("barWater").style.width = waterPerc + "%";
}

function calculateGlobalStanding(data) {
    // Weighted health score calculation (Max 100)
    const stepPoints = Math.min((data.steps / 10000) * 40, 40);
    const sleepPoints = Math.min((data.sleep / 8) * 30, 30);
    const waterPoints = Math.min((data.water / 3) * 30, 30);
    const totalScore = Math.round(stepPoints + sleepPoints + waterPoints);

    const rankElement = document.getElementById("globalRank");
    const scoreBar = document.getElementById("userScoreBar");

    scoreBar.style.width = totalScore + "%";

    if (totalScore >= 85) {
        rankElement.innerText = "#125 (Top 5% Network)";
    } else if (totalScore >= 60) {
        rankElement.innerText = "#12,890 (Top 40% Network)";
    } else {
        rankElement.innerText = "#45,210 (Global Tier 3)";
    }
}

/**
 * Gamification: Streaks & Challenges
 */
function saveDailyData() {
    const today = new Date().toLocaleDateString();
    const lastDate = localStorage.getItem("lastEntryDate");
    let streak = parseInt(localStorage.getItem("healthStreak")) || 0;

    // Check if consecutive day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate === yesterday.toLocaleDateString()) {
        streak++;
    } else if (lastDate !== today) {
        streak = 1;
    }

    localStorage.setItem("healthStreak", streak);
    localStorage.setItem("lastEntryDate", today);
    
    updateStreakDisplay();
    showToast("System Synced. Streak validated. 🔥");
}

function updateStreakDisplay() {
    const streak = localStorage.getItem("healthStreak") || 0;
    document.getElementById("streakCount").innerText = streak;
}

function generateChallenge() {
    const challenges = [
        "EXECUTE: 20 air squats in current location.",
        "INITIATE: Hydration intake (500ml).",
        "SYNC: 2 minutes of focused breathing.",
        "MOBILE: 10-minute movement interval."
    ];
    
    const task = challenges[Math.floor(Math.random() * challenges.length)];
    document.getElementById("challengeText").innerText = task;
    document.getElementById("challengeDisplay").style.display = "block";
}

function shareChallenge() {
    const challenge = document.getElementById("challengeText").innerText;
    const shareMsg = `HealthCompass AI Protocol: ${challenge} Join the network!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`);
}

/**
 * System Utilities (Toasts & Reminders)
 */
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast show";
    toast.innerHTML = `<i class="fas fa-terminal"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function setupSmartReminders() {
    // Background check for hydration every 60 seconds
    setInterval(() => {
        if (!userData.water || userData.water < 1.5) {
            showToast("DATA ALERT: Hydration level below threshold.");
        }
    }, 60000);
}

function exportToDoctor() {
    const w = window.open();
    const content = document.getElementById("report").innerHTML;
    w.document.write(`
        <body style="font-family:sans-serif; padding:50px;">
            <h1 style="color:#0a6cf1;">HealthCompass AI - Clinical Log</h1>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
            <hr>
            ${content}
            <p style="margin-top:50px; font-size:12px; color:#666;">
                System Status: Verified Data Log.
            </p>
        </body>
    `);
    w.print();
}
