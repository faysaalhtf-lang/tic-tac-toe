# Tic-Tac-Toe Gemini AI Game

This is a visually stunning, futuristic Tic-Tac-Toe game where you can challenge a powerful AI opponent powered by the Gemini API.

## How to Run This Web Application

To run this game on your local machine, you need a simple local web server. You do not need a complex build process.

### Prerequisites

-   A modern web browser (like Chrome, Firefox, or Edge).
-   A simple local web server. If you have Node.js installed, you can use `npx serve`.

### Step-by-Step Instructions

1.  **(Optional) Set up your API Key for AI Mode:**
    This game can be played in "2 Player" mode without any setup. To play against the AI, you need a Gemini API key.

    -   Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   Open the `env.js` file that is included with the project.
    -   Replace `YOUR_API_KEY_HERE` with your actual Gemini API key.

    ```javascript
    // In env.js
    window.process = {
      env: {
        API_KEY: 'YOUR_API_KEY_HERE' // <--- Paste your key here
      }
    };
    ```
    **Important:** Do not share this file publicly as it contains your secret API key.

2.  **Start a Local Server:**
    To play the game, you must run it from a local web server. **Simply opening the `index.html` file directly in your browser will not work** due to web security restrictions. This is very easy to set up!

    Open your terminal or command prompt in the project's root directory (where `index.html` is located) and run one of the following commands:

    -   If you have Node.js installed:
        ```bash
        npx serve
        ```
    -   If you have Python 3 installed:
        ```bash
        python -m http.server
        ```

3.  **Open the Game:**
    Your terminal will show a local address, usually `http://localhost:3000` or `http://localhost:8000`. Open this URL in your web browser to play the game.

### Why Is a Local Server Needed?

You might wonder why you can't just double-click the `index.html` file. When you open a file this way, your browser uses the `file://` protocol. For security reasons, modern browsers heavily restrict what JavaScript can do when run from `file://`.

This game uses JavaScript Modules (`import`/`export`) and an in-browser compiler (Babel) to run without a complex build step. These features require the `http://` or `https://` protocol to work correctly.

Running a simple local server (like `npx serve` or `python -m http.server`) is a standard and secure way to test and run web applications locally. It correctly serves the files over `http://`, allowing the game to load and run as intended.

---

That's it! Enjoy the game.