
let books = [];

fetch('books.json')
  .then(res => res.json())
  .then(data => books = data);

function handleMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("You", userText);
  input.value = "";

  const lower = userText.toLowerCase();

  // Try to find matching book
  const found = books.find(book =>
    lower.includes(book.title.toLowerCase())
  );

  if (found) {
    let response = `📖 "${found.title}" is a ${found.genre} book. `;
    response += `Available copies: ${found.count}.`;
    appendMessage("BookBot", response);
    fetchSummary(found.title); // now using real summary
  } else {
    appendMessage("BookBot", "Sorry, I couldn't find that book in our library.");
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = sender === "You" ? "user-msg" : "bot-msg";
  msg.textContent = `${sender}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔍 Fetch summary using Google Books API
async function fetchSummary(title) {
  appendMessage("BookBot", `Searching the web for more about "${title}"...`);

  const query = title.replace(/\s+/g, '+');
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.totalItems > 0) {
      const info = data.items[0].volumeInfo;
      const description = info.description || "No summary available.";
      const author = info.authors ? `by ${info.authors.join(", ")}` : "";

      appendMessage("BookBot", `📚 *${info.title}* ${author}\n\n${description}`);
    } else {
      appendMessage("BookBot", "Couldn't find a summary online.");
    }
  } catch (error) {
    appendMessage("BookBot", "Error fetching book info from the web.");
    console.error(error);
  }
}
