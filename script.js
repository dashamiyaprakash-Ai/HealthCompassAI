document.addEventListener("DOMContentLoaded", () => {
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_CLIENT_ID", 
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
    const steps = +document.getElementById("steps").value;
    const sleep = +document.getElementById("sleep").value;
    const water = +document.getElementById("water").value;
    
    runAnalysis(steps, sleep, water);
});

function runAnalysis(steps, sleep, water) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    const isCritical = (steps === 0 && sleep === 0 && water === 0);

    loader.style.display = "block";
    insights.style.display = "none";
    if (isCritical) loader.classList.add("reboot-mode");

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status = isCritical ? "STATUS: VERY MUCH LOW 🔴" : "STATUS: BALANCED 🟡";
        let videoId = isCritical ? "6_vOInS_A8c" : "hBEKGBLAB80";

        document.getElementById("report").innerHTML = `<h3 style="color:${isCritical ? '#ff2e63' : '#0ea5e9'}">${status}</h3>`;
        document.getElementById("videoContainer").innerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0"></iframe>`;
        
        // Fix: Bars do not rise if input is 0
        document.getElementById("barSteps").style.width = steps === 0 ? "0%" : Math.min(steps/100, 100) + "%";
        document.getElementById("barWater").style.width = water === 0 ? "0%" : Math.min(water/3*100, 100) + "%";
    }, 2000);
}
