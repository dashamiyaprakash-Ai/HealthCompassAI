document.addEventListener("DOMContentLoaded", () => {
    updateStreak();
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "75394226156-6gq6kjk.apps.googleusercontent.com",
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
    
    // Restoration of Weighted Algorithm
    const stepWeight = Math.min(data.steps / 8000, 1) * 40;
    const sleepWeight = Math.min(data.sleep / 8, 1) * 30;
    const waterWeight = Math.min(data.water / 3, 1) * 30;
    const totalScore = Math.round(stepWeight + sleepWeight + waterWeight);

    loader.style.display = "block";
    insights.style.display = "none";

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status, videoId;
        if (totalScore < 20) {
            status = "VERY MUCH LOW 🔴";
            videoId = "ziCRIWMOjGo"; 
        } else if (data.steps >= 7000 && totalScore > 75) {
            status = "OPTIMIZED 🟢";
            videoId = "6A7Rbl_FKMU";
        } else {
            status = "BALANCED 🟡";
            videoId = "hBEKGBLAB80";
        }

        document.getElementById("report").innerHTML = `<h2>MODE TYPE: ${totalScore}% Optimized</h2><p>Status: ${status}</p>`;
        document.getElementById("videoContainer").innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

        // Bar Animation Fix
        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min((data.steps/8000)*100, 100) + "%") : "0%";
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min((data.water/3)*100, 100) + "%") : "0%";
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min((data.sleep/8)*100, 100) + "%") : "0%";
    }, 1500);
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
