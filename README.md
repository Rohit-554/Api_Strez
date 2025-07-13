# 🛡️ Sentinel AI Puzzle Challenge

Welcome to the **Sentinel AI Infiltration Challenge** — an API-based puzzle competition designed to test your logical thinking, decoding skills, and technical instincts. Solve each layer by following encrypted clues, decoding headers, and making clever requests.

## What is this?

This project is a **10-step API puzzle challenge** where each API endpoint gives you a riddle, code, or cipher you must solve to reach the next stage. It simulates a security infiltration storyline using creative programming puzzles.

## Challenge Theme

> You're a white-hat hacker infiltrating the **Sentinel AI Defense Grid** to test its security layers. Each layer is protected by encryption techniques, logic puzzles, and custom protocols. Only the smartest will reach the core.

## What You'll Encounter

* 🔢 Math Puzzles (via HMAC-authenticated answers)
* 🧩 Encrypted headers (Base64, ROT13, Morse Code, Hex)
* 🔐 POST requests with custom schema requirements
* 🧠 Hidden riddles and logic clues
* 💻 Stateless API structure with dynamic verification

## Technologies Used

* **Node.js + Fastify** (blazing fast API server)
* **Crypto (HMAC, SHA-256)** for answer signing
* **Base64 / ROT13 / Morse / Hex encodings**
* **Custom header responses and JSON validation**
* **In-memory puzzle state management**

## How to Play

1. Clone this repo and install dependencies:
   ```bash
   npm install
   ```
2. Start the API server:
   ```bash
   node index.mjs
   ```
3. Open your browser or Postman and hit:
   ```
   http://localhost:3000/
   ```
4. Follow the instructions and decode the headers. Some steps require `GET`, others require `POST`.
5. Each step will guide you (via riddles) to the right action, including:
   * What to decode (e.g., Base64, ROT13)
   * What JSON to POST
   * What headers to check

## Sample POST Schema (Step Example)
For Step 2
```json

{
  "id": "generated-id-from-header",
  "answer": "42",
  "token": "HMAC_HASH_USING_SECRET"
}
```

Each step's JSON requirements will be clearly hinted at in riddles and examples.

## What You Get When You Finish

* A secret hacker badge (`WHH-XXXXXX`)
* Message from the Sentinel AI Core
* The title of **"Elite Digital Defender"**
* Bragging rights as an **API decoding master** 💥

## Contributions & Customization

Want to:
* Add more cipher types?
* Add authentication or timer?
* Convert to multiplayer competition?

Fork and have fun! Open PRs welcome.

## 🧙‍♂️ Special Thanks

This challenge was inspired by real-world CTFs (Capture the Flag) and API decoding adventures.
