// ------------------- Dark/Light Mode -------------------
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ------------------- Health Report -------------------
function generateReport() {
  const steps = Number(document.getElementById("steps").value);
  const sleep = Number(document.getElementById("sleep").value);
  const water = Number(document.getElementById("water").value);
  const report = document.getElementById("report");

  let health = "Average Health";

  if (steps >= 8000 && sleep >= 7 && sleep <= 9 && water >= 2.5) {
    health = "Health is Good";
  } else if (steps < 4000 || sleep < 6 || water < 1.5) {
    health = "Low Health";
  }

  report.textContent = `Your health status: ${health}`;
}

// ------------------- AI Assistant -------------------
async function askAI() {
  const question = document.getElementById("userQuestion").value.trim();
  const chat = document.getElementById("chat");

  if (!question) {
    alert("Please ask a question");
    return;
  }

  chat.innerHTML += `<p><strong>You:</strong> ${question}</p>`;

  try {
    const response = await fetch("/.netlify/functions/askAI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    chat.innerHTML += `<p><strong>AI:</strong> ${data.answer}</p>`;
    speakText(data.answer);

  } catch (err) {
    chat.innerHTML += `<p><strong>AI:</strong> Unable to get information at this time.</p>`;
  }

  document.getElementById("userQuestion").value = "";
}

// ------------------- Text-to-Speech -------------------
function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
