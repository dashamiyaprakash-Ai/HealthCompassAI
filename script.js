document.addEventListener("DOMContentLoaded", () => {
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with actual ID
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "outline", size: "large" });
});

function handleCredentialResponse(response) {
    document.getElementById("loginOverlay").style.display = "none";
}

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        steps: +document.getElementById("steps").value,
        sleep: +document.getElementById("sleep").value,
        water: +document.getElementById("water").value,
        mood: document.getElementById("mood").value
    };
    generateReport(data);
});

function generateReport(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    loader.style.display = "block";
    insights.style.display = "none";

    const score = (data.steps/10000 * 40) + (data.sleep/8 * 30) + (data.water/3 * 30);
    const isVeryLow = (data.steps === 0 && data.sleep === 0 && data.water === 0) || score < 20;

    if (isVeryLow) loader.classList.add("reboot-mode");

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let status = isVeryLow ? "STATUS: VERY MUCH LOW 🔴" : "STATUS: BALANCED 🟡";
        let videoId = isVeryLow ? "6_vOInS_A8c" : "hBEKGBLAB80";
        if (score > 80) { status = "STATUS: OPTIMIZED 🟢"; videoId = "mTMfiv-zeuE"; }

        document.getElementById("report").innerHTML = `<h3 style="color:${isVeryLow ? '#ff2e63':'var(--tech-blue)'}">${status}</h3>`;
        document.getElementById("videoContainer").innerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0"></iframe>`;
        
        // Update Bars only if not zero
        document.getElementById("barSteps").style.width = isVeryLow ? "0%" : (Math.min(data.steps/100, 100) + "%");
        document.getElementById("barWater").style.width = isVeryLow ? "0%" : (Math.min(data.water/3*100, 100) + "%");
        document.getElementById("barSleep").style.width = isVeryLow ? "0%" : (Math.min(data.sleep/8*100, 100) + "%");
    }, 2000);
}
