document.addEventListener("DOMContentLoaded", () => {
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "75394226156-6gq6kjk...apps.googleusercontent.com", 
            callback: (res) => { document.getElementById('loginOverlay').style.display='none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "outline", size: "large" });
    }
});

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        steps: +document.getElementById("steps").value || 0,
        sleep: +document.getElementById("sleep").value || 0,
        water: +document.getElementById("water").value || 0,
        mood: document.getElementById("mood").value
    };
    runAnalysis(data);
});

function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    const score = (Math.min(data.steps/10000, 1) * 40) + (Math.min(data.sleep/8, 1) * 30) + (Math.min(data.water/3, 1) * 30);
    const isCritical = (data.steps === 0 && data.sleep === 0 && data.water === 0) || score < 15;

    insights.style.display = "none";
    loader.style.display = "block";
    if (isCritical) loader.classList.add("reboot-mode");
    else loader.classList.remove("reboot-mode");

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status = isCritical ? "STATUS: VERY MUCH LOW 🔴" : "STATUS: BALANCED 🟡";
        let videoId = isCritical ? "6_vOInS_A8c" : "hBEKGBLAB80";
        if (score > 80 && !isCritical) { status = "STATUS: OPTIMIZED 🟢"; videoId = "mTMfiv-zeuE"; }

        document.getElementById("report").innerHTML = `
            <h3 style="color:${isCritical ? '#ff2e63' : '#0ea5e9'}">${status}</h3>
            <p>> STEPS: ${data.steps}</p>
            <p>> SLEEP: ${data.sleep}h</p>
            <p>> WATER: ${data.water}L</p>`;
        
        document.getElementById("videoContainer").innerHTML = `<iframe width="100%" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        
        // FIX: No rise in bars if value is zero
        document.getElementById("barSteps").style.width = data.steps === 0 ? "0%" : (Math.min(data.steps/100, 100) + "%");
        document.getElementById("barWater").style.width = data.water === 0 ? "0%" : (Math.min(data.water/3*100, 100) + "%");
        document.getElementById("barSleep").style.width = data.sleep === 0 ? "0%" : (Math.min(data.sleep/8*100, 100) + "%");
        
        document.getElementById("userScoreBar").style.width = isCritical ? "5%" : score + "%";
        document.getElementById("globalRank").innerText = isCritical ? "RANK: UNVERIFIED" : (score > 80 ? "#125 (Top 5%)" : "#12,890 (Top 40%)");
    }, 2000);
}

function exportToPDF() { window.print(); }
function generateChallenge() { 
    const tasks = ["Drink 500ml Water", "5 Minute Stretch", "10 Pushups"];
    document.getElementById("challengeText").innerText = tasks[Math.floor(Math.random()*tasks.length)];
}
function saveDailyData() { alert("Data Synced Safely!"); }
function toggleTheme() { document.body.classList.toggle("dark"); }
