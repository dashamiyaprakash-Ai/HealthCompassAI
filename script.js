document.addEventListener("DOMContentLoaded", () => {
    updateStreak();
    renderTimeline();
    
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "75394226156-6gq6kjk.apps.googleusercontent.com",
            callback: () => { document.getElementById('loginOverlay').style.display = 'none'; }
        });
        google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "filled_blue", size: "large" });
    }
});

let currentReportData = {};

document.getElementById("healthForm").addEventListener("submit", (e) => {
    e.preventDefault();
    runAnalysis({
        steps: +document.getElementById("steps").value || 0,
        sleep: +document.getElementById("sleep").value || 0,
        water: +document.getElementById("water").value || 0
    });
});

function runAnalysis(data) {
    const loader = document.getElementById("diagnosticLoader");
    const insights = document.getElementById("ai-insights");
    const intent = document.getElementById("userIntent").value;
    const difficulty = document.getElementById("difficulty").value;
    const reasoning = document.getElementById("reasoning").value;

    const memory = JSON.parse(localStorage.getItem("health_memory_system") || "[]");

    // 1. CALCULATE SCORE
    let totalScore = 0;
    if (data.steps === 0 && data.sleep === 0 && data.water === 0) {
        totalScore = 0;
    } else {
        totalScore = Math.round(
            (Math.min(data.steps / 8000, 1) * 40) + 
            (Math.min(data.sleep / 8, 1) * 30) + 
            (Math.min(data.water / 3, 1) * 30)
        );
    }

    // 2. HEALTH MODE
    let healthMode = "";
    if (totalScore === 0) {
        healthMode = "VERY MUCH LOW 🔴";
    } else if (totalScore >= 80) {
        healthMode = "OPTIMIZED 🟢";
    } else if (totalScore >= 40) {
        healthMode = "BALANCED 🟡";
    } else {
        healthMode = "LOW POWER 🟠";
    }

    loader.style.display = "block";
    insights.style.display = "none";

    setTimeout(() => {
        loader.style.display = "none";
        insights.style.display = "grid";
        
        let aiGuidance = "";
        let videoId = "hBEKGBLAB80"; 
        let dynamicChallenge = "Walk 2000 Steps"; 

        // 3. PATTERN RECOGNITION
        const pastDifficulties = memory.filter(m => m.difficulty === difficulty);

        if (pastDifficulties.length > 0) {
            const lastDate = pastDifficulties[pastDifficulties.length - 1].date.split(',')[0];
            
            if (difficulty === "fatigue") {
                aiGuidance = `<strong>📉 PATTERN RECOGNITION:</strong> You faced 'Low Battery' on ${lastDate}. History shows light movement aids recovery better than total rest.`;
                dynamicChallenge = "🏃 Recovery Run: Jog 100m"; 
                videoId = "ziCRIWMOjGo"; 
            } else if (difficulty === "time") {
                aiGuidance = `<strong>⏳ CONTEXT RECALL:</strong> Detected 'Time Crunch'. Suggesting the 15-min HIIT protocol you used on ${lastDate}.`;
                dynamicChallenge = "⚡ HIIT: 5 Mins Intensity";
            } else if (difficulty === "emotions") {
                 aiGuidance = `<strong>🧠 MEMORY BRIDGE:</strong> High cognitive load detected. Prioritize sleep over steps tonight.`;
                 dynamicChallenge = "🧘 Meditate: 10 Mins";
            } else {
                 aiGuidance = `<strong>🔁 RECURRING CONTEXT:</strong> Difficulty '${difficulty}' detected again. Applying previous adaptation strategy.`;
                 dynamicChallenge = "🔄 Maintenance: Drink 1L Water";
            }
        } else {
            if (healthMode.includes("VERY MUCH LOW")) {
                aiGuidance = "<strong>🚨 CRITICAL ALERT:</strong> Zero activity detected. System stagnation risk high. Immediate movement required.";
                dynamicChallenge = "🚶 Emergency: Walk 500 Steps NOW";
            } else if (totalScore > 80) {
                aiGuidance = "<strong>🚀 OPTIMIZED:</strong> Goals and biological output are fully synced.";
                dynamicChallenge = "🏆 Elite: Push for 10k Steps";
                videoId = "6A7Rbl_FKMU";
            } else {
                aiGuidance = `<strong>✅ ALIGNMENT:</strong> Metrics support your goal: ${intent}`;
            }
        }

        // 4. Update UI
        document.getElementById("challengeText").innerText = dynamicChallenge;
        currentReportData = { intent, difficulty, score: totalScore, guidance: aiGuidance.replace(/<[^>]*>?/gm, ''), challenge: dynamicChallenge };

        document.getElementById("report").innerHTML = `
            <h2>STATUS: ${healthMode}</h2>
            <div style="font-size: 1.1rem; line-height: 1.6;">
                <p><strong>🎯 Goal:</strong> ${intent}</p>
                <p><strong>🚧 Difficulty:</strong> ${formatDifficulty(difficulty)}</p>
                <p><strong>📊 Score:</strong> ${totalScore}%</p>
                <div style="background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0ea5e9; padding: 10px; margin: 10px 0;">
                    ${aiGuidance}
                </div>
                <p><strong>💪 Challenge:</strong> ${dynamicChallenge}</p>
                <p><strong>💭 Reasoning:</strong> ${reasoning}</p>
                <hr style="border-color:#334155">
                <p><i>Memory Node Synced.</i></p>
            </div>`;

        document.getElementById("videoContainer").innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        document.getElementById("adviceContent").innerText = "System preserving context for long-term continuity.";

        document.getElementById("barSteps").style.width = data.steps > 0 ? (Math.min((data.steps / 8000) * 100, 100) + "%") : "0%";
        document.getElementById("barWater").style.width = data.water > 0 ? (Math.min((data.water / 3) * 100, 100) + "%") : "0%";
        document.getElementById("barSleep").style.width = data.sleep > 0 ? (Math.min((data.sleep / 8) * 100, 100) + "%") : "0%";
        
        updateGlobalRanking(totalScore);

        // Save
        const newMemory = { 
            date: new Date().toLocaleString(),
            intent, difficulty, reasoning, score: totalScore 
        };
        memory.push(newMemory);
        localStorage.setItem("health_memory_system", JSON.stringify(memory));
        
        saveDailyData(); 
        renderTimeline(); 

    }, 1500);
}

function formatDifficulty(diff) {
    const map = {
        'fatigue': '🔋 Low Battery',
        'time': '⏳ Time Crunch',
        'emotions': '🧠 High Load',
        'physical': '🩹 Injury',
        'none': '🟢 Normal'
    };
    return map[diff] || diff;
}

function shareData(platform) {
    const text = `HealthCompass AI 🧭\nStatus: ${currentReportData.score}% Optimized\nChallenge: ${currentReportData.challenge}\n"${currentReportData.guidance}"\n\n#HumanAI #MemoryContinuity`;
    const url = window.location.href;

    if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'native') {
        if (navigator.share) {
            navigator.share({ title: 'HealthCompass AI Report', text: text, url: url }).catch(console.error);
        } else {
            alert("Native sharing not supported.");
        }
    }
}

// FIXED: Now includes REASONING in the timeline display
function renderTimeline() {
    const memory = JSON.parse(localStorage.getItem("health_memory_system") || "[]");
    const timeline = document.getElementById("decisionTimeline");
    if (memory.length === 0) {
        timeline.innerHTML = "<p class='terminal-text'>No memory nodes found.</p>";
        return;
    }
    timeline.innerHTML = memory.slice().reverse().map(m => `
        <div style="border-bottom: 1px solid #334155; padding: 10px 0; margin-bottom: 10px;">
            <small style="color:#94a3b8">${m.date}</small><br>
            <span style="color:#0ea5e9">Goal:</span> ${m.intent} <br>
            <span style="color:#ff2e63">Diff:</span> ${formatDifficulty(m.difficulty)}<br>
            <span style="color:#a855f7">Reason:</span> <i>${m.reasoning}</i>
        </div>
    `).join("");
}

function updateGlobalRanking(score) {
    const percentile = Math.round(score * 0.98);
    document.getElementById("percentileText").innerText = percentile + "%";
    document.getElementById("barGlobal").style.width = percentile + "%";
    document.getElementById("rankTier").innerText = percentile > 85 ? "Tier: Elite Node" : "Tier: Active Node";
}

function saveDailyData() {
    let streak = parseInt(localStorage.getItem("hc_streak") || 0) + 1;
    localStorage.setItem("hc_streak", streak);
    document.getElementById("streakCount").innerText = streak;
}

function updateStreak() {
    document.getElementById("streakCount").innerText = localStorage.getItem("hc_streak") || 0;
}

function clearMemory() {
    if(confirm("Privacy Action: Erase all memory context nodes?")) {
        localStorage.removeItem("health_memory_system");
        renderTimeline();
    }
}
