require("dotenv").config();
const OpenAI = require("openai");
const express = require("express");
const { OPENAI_API_KEY, ASSISTANT_ID } = process.env;

// Setup Express
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Set up OpenAI Client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Assistant can be created via API or UI
const assistantId = ASSISTANT_ID;
let pollingInterval;

// Set up a Thread
async function createThread() {
  console.log("Creating a new thread...");
  const thread = await openai.beta.threads.create();
  return thread;
}

async function addMessage(threadId, message) {
  console.log("Adding a new message to thread: " + threadId);
  const response = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
  return response;
}

async function runAssistant(threadId) {
  console.log("Running assistant for thread: " + threadId);
  const response = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // Make sure to not overwrite the original instruction, unless you want to
  });

  console.log(response);

  return response;
}

async function checkingStatus(res, threadId, runId) {
  try {
    const runObject = await openai.beta.threads.runs.retrieve(threadId, runId);
    const status = runObject.status;
    console.log(runObject);
    console.log("Current status: " + status);

    if (status == "completed") {
      clearInterval(pollingInterval);

      const messagesList = await openai.beta.threads.messages.list(threadId);
      let messages = [];

      messagesList.body.data.forEach((message) => {
        messages.push(message.content);
      });

      res.json({ messages });
    }
  } catch (error) {
    console.error("Error retrieving status:", error);
    res.status(500).json({ error: "An error occurred while checking status" });
  }
}
//hola
app.get("/thread", (req, res) => {
  createThread()
    .then((thread) => {
      res.json({ threadId: thread.id });
    })
    .catch((error) => {
      console.error("Error creating thread:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating thread" });
    });
});

app.post("/message", async (req, res) => {
  const { message, threadId } = req.body;
  if (!message || !threadId) {
    return res.status(400).json({ error: "Missing message or threadId" });
  }
  console.log("Received message:", message);
  console.log("Thread ID:", threadId);
  try {
    const addedMessage = await addMessage(threadId, message);
    const run = await runAssistant(threadId);
    const runId = run.id;

    pollingInterval = setInterval(() => {
      checkingStatus(res, threadId, runId);
    }, 2000); // Check every 2 seconds
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
