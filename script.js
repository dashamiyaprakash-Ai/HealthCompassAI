let userData = {};

// On Launch
document.addEventListener("DOMContentLoaded", () => {
    initGoogleLogin();
    updateStreakDisplay();
});

// GOOGLE AUTHENTICATION
function initGoogleLogin() {
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
    );
}

function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);
    document.getElementById("loginOverlay").style.display = "none";
    const profile = document.getElementById("userProfile");
    profile.style.display = "flex";
    profile.innerHTML = `<img src="${data.picture}" alt="user" style="width:25px; border-radius:50%;"> <span>${data.given_name}</span>`;
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    return JSON.parse(window.atob(base64Url));
}

// DIAGNOSTIC & ANALYSIS
document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // UI Transitions
    document.getElementById("ai-insights").style.display = "none";
    document.getElementById("diagnosticLoader").style.display = "block";
    
    userData = {
        steps: +document.getElementById("steps").value,
        sleep: +document.getElementById("sleep").value,
        water: +document.getElementById("water").value,
        mood: document.getElementById("mood").value
    };

    // Simulate AI Processing
    setTimeout(() => {
        document.getElementById("diagnosticLoader").style.display = "none";
        generateReport(userData);
    }, 2000);
});

function generateReport(data) {
    document.getElementById("ai-insights").style.display = "grid";
    let status = "STATUS: BALANCED 🟡";
    let videoId = "hBEKGBLAB80"; // Ali Abdaal - 8 Hacks
    let advice = "Optimization required. Executing Ali Abdaal health protocols.";

    if (data.steps >= 8000 && data.sleep >= 7 && data.water >= 2.5 && data.mood === "Good") {
        status = "STATUS: OPTIMIZED 🟢";
        videoId = "mTMfiv-zeuE"; // Yoga/Performance for Good Health
        advice = "Peak performance confirmed. Loading advanced recovery logic.";
    }

    document.getElementById("report").innerHTML = `
        <h3 style="color:var(--tech-blue)">${status}</h3>
        <p>> BIOMETRIC_STEPS: ${data.steps}</p>
        <p>> REST_CYCLES: ${data.sleep}h</p>
        <p>> HYDRATION_METRIC: ${data.water}L</p>
    `;
    
    document.getElementById("adviceContent").innerText = advice;
    document.getElementById("videoContainer").innerHTML = `
        <iframe width="100%" height="215" src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    updateUI(data);
}

function updateUI(data) {
    document.getElementById("barSteps").style.width = Math.min((data.steps / 10000) * 100, 100) + "%";
    document.getElementById("barWater").style.width = Math.min((data.water / 3) * 100, 100) + "%";
    
    const score = Math.round((Math.min(data.steps/10000,1)*40) + (Math.min(data.sleep/8,1)*30) + (Math.min(data.water/3,1)*30));
    document.getElementById("userScoreBar").style.width = score + "%";
    document.getElementById("globalRank").innerText = score > 80 ? "#125 (Top 5% Network)" : "#12,890 (Top 40%)";
}

// SYSTEMS
function generateChallenge() {
    const tasks = ["INITIATE 20 SQUATS", "CONSUME 1L WATER", "10MIN MOVEMENT SCAN"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random()*tasks.length)];
    document.getElementById("challengeDisplay").style.display = "block";
}

function shareChallenge() {
    window.open(`https://wa.me/?text=Optimizing with HealthCompass AI! Challenge: ${document.getElementById("challengeText").innerText}`);
}

function saveDailyData() {
    let streak = (parseInt(localStorage.getItem("healthStreak")) || 0) + 1;
    localStorage.setItem("healthStreak", streak);
    updateStreakDisplay();
    alert("Data Uplink Successful! 🔥");
}

function updateStreakDisplay() {
    document.getElementById("streakCount").innerText = localStorage.getItem("healthStreak") || 0;
}

function exportToDoctor() {
    const w = window.open();
    w.document.write(`<h1>HealthCompass Summary Log</h1><hr>${document.getElementById("report").innerHTML}`);
    w.print();
}

function toggleTheme() { document.body.classList.toggle("dark"); }
