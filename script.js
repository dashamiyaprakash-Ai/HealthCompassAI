document.addEventListener("DOMContentLoaded", () => {
    // Google Sign-In Init
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_ID", // Replace with your ID if needed
            callback: () => { document.getElementById('loginOverlay').style.display='none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "filled_blue", size: "large" });
    }
    updateStreak();
});

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        steps: Math.max(0, +document.getElementById("steps").value || 0),
        sleep: Math.max(0, +document.getElementById("sleep").value || 0),
        water: Math.max(0, +document.getElementById("water").value || 0)
    };
    runAnalysis(data);
});

function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    
    // Weighted Score: Steps (40%), Sleep (30%), Water (30%)
    const score = (Math.min(data.steps/10000, 1)*40) + (Math.min(data.sleep/8, 1)*30) + (Math.min(data.water/3, 1)*30);

    loader.style.display = "block";
    insights.style.display = "none";

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        document.getElementById("reportDate").innerText = new Date().toLocaleString();

        let status, videoId, advice;

        // SPECIFIC LOGIC FOR VIDEO URLS
        if (score < 20) {
            status = "VERY MUCH LOW 🔴";
            videoId = "ziCRIWMOjGo"; // Your provided link for low results
            advice = "CRITICAL: You are in the stagnation zone. Watch this for immediate motivation.";
        } else if (score > 80) {
            status = "OPTIMIZED 🟢";
            videoId = "6A7Rbl_FKMU"; // Your provided link for brain exercises
            advice = "EXCELLENT: Peak performance achieved. Try these advanced brain exercises.";
        } else {
            status = "BALANCED 🟡";
            videoId = "hBEKGBLAB80"; // Default protocol
            advice = "STABLE: You are doing well. Maintain hydration and consistent rest cycles.";
        }

        document.getElementById("report").innerHTML = `
            <h2 style="color:${score < 20 ? '#ff2e63' : '#0ea5e9'}">STATUS: ${status}</h2>
            <div style="font-size: 1.1rem; line-height: 1.8;">
                <p><strong>Step Count:</strong> ${data.steps} / 10,000</p>
                <p><strong>Sleep Recorded:</strong> ${data.sleep} Hours</p>
                <p><strong>Hydration Level:</strong> ${data.water} Liters</p>
                <hr style="border:0; border-top:1px solid #334155;">
                <p><strong>Overall AI Score:</strong> ${Math.round(score)}%</p>
            </div>
        `;

        // Update Video using Embed logic
        document.getElementById("videoContainer").innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        `;
        document.getElementById("adviceContent").innerText = advice;

        // FIXED: Bar rise logic (No rise if 0)
        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min(data.steps/100, 100) + "%") : "0%";
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min(data.water/3*100, 100) + "%") : "0%";
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min(data.sleep/8*100, 100) + "%") : "0%";

    }, 1500);
}

function printReport() { window.print(); }

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("hc_streak") || 0) + 1;
    localStorage.setItem("hc_streak", streak);
    updateStreak();
    alert("Data Synced! Streak Updated.");
}

function updateStreak() {
    document.getElementById("streakCount").innerText = localStorage.getItem("hc_streak") || 0;
}
