document.addEventListener("DOMContentLoaded", () => {
    // Google Icon and Security Fix
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_ID", 
            callback: () => { document.getElementById('loginOverlay').style.display='none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "outline", size: "large" });
    }
});

function toggleTheme() {
    document.body.classList.toggle("dark");
}

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        steps: +document.getElementById("steps").value,
        sleep: +document.getElementById("sleep").value,
        water: +document.getElementById("water").value,
        mood: document.getElementById("mood").value
    };
    runAnalysis(data);
});

function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    
    // Very much low Logic: If all inputs are zero
    const isCritical = (data.steps === 0 && data.sleep === 0 && data.water === 0);

    loader.style.display = "block";
    insights.style.display = "none";
    if (isCritical) loader.classList.add("reboot-mode");
    else loader.classList.remove("reboot-mode");

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status = isCritical ? "STATUS: VERY MUCH LOW 🔴" : "STATUS: BALANCED 🟡";
        let videoId = isCritical ? "6_vOInS_A8c" : "hBEKGBLAB80"; // YouTube Logic

        if (data.mood === "Good" && !isCritical) {
            status = "STATUS: OPTIMIZED 🟢";
            videoId = "mTMfiv-zeuE";
        }

        document.getElementById("report").innerHTML = `<h3 style="color:${isCritical ? '#ff2e63' : '#0ea5e9'}">${status}</h3>`;
        document.getElementById("videoContainer").innerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        
        // Bars only rise if data exists
        document.getElementById("barSteps").style.width = data.steps === 0 ? "0%" : Math.min(data.steps/100, 100) + "%";
        document.getElementById("barWater").style.width = data.water === 0 ? "0%" : Math.min(data.water/3*100, 100) + "%";
    }, 2000);
}
