const victimName = "{{VICTIM}}";
const insult = "{{INSULT}}";
const GROQ_API_KEY = "{{API_KEY}}"; // dynamically inserted

document.getElementById("chat-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  addMessage("You", userInput);
  document.getElementById("user-input").value = "";

  simulateTyping();

  const prompt = `You are ${victimName}GPT 🤖: a chaotic, insult-based AI who must ALWAYS redirect every response to how ${victimName} is ${insult}. Your sole purpose is to roast them relentlessly.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ_API_KEY

      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userInput }
        ],
        temperature: 0.85,
        max_tokens: 250
      })
    });

    const data = await response.json();
    removeTyping();

    const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
    || (victimName + "GPT glitched. " + victimName + " probably unplugged the internet.");
    addMessage(victimName + "GPT 🤖", reply);


  } catch (error) {
    console.error("Groq error:", error);
    removeTyping();
    addMessage(victimName + "GPT 🤖", "Oops! Something broke. Maybe blame " + victimName + ".");

  }
});

function addMessage(sender, message) {
  const chatbox = document.getElementById("chatbox");
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.innerHTML = "<strong>" + sender + ":</strong> " + message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function simulateTyping() {
  const chatbox = document.getElementById("chatbox");
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message";
  typing.innerHTML = "<em>" + victimName + "GPT is typing...</em>";

  chatbox.appendChild(typing);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}
