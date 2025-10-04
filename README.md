# Tic-Tac-Toe Gemini AI Game

This is a visually stunning, futuristic Tic-Tac-Toe game where you can challenge a powerful AI opponent powered by the Gemini API.

## Important Note for Android Studio Users

You have received an error like "Module Not Specified" because this is a **web application**, not a native Android application. It is built with web technologies (React, TypeScript, HTML, CSS) and is meant to be run in a web browser. You cannot build or run it directly as an Android project.

However, you can use Android Studio as a powerful code editor for this project. To improve code intelligence and remove errors within the editor, a `tsconfig.json` file has been added.

## How to Run This Web Application

To run this game on your local machine, you need a simple local web server. You do not need a complex build process.

### Prerequisites

-   A modern web browser (like Chrome, Firefox, or Edge).
-   A Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   A simple local web server. If you have Node.js installed, you can use `npx serve`.

### Step-by-Step Instructions

1.  **Set up your API Key:**
    Create a new file named `env.js` in the same directory as `index.html`. Add the following content to it, replacing `YOUR_API_KEY_HERE` with your actual Gemini API key:

    ```javascript
    // env.js
    window.process = {
      env: {
        API_KEY: 'YOUR_API_KEY_HERE'
      }
    };
    ```
    **Important:** Do not share this file publicly as it contains your secret API key.

2.  **Start a Local Server:**
    Open your terminal or command prompt in the project's root directory (where `index.html` is located) and run one of the following commands:

    -   If you have Node.js:
        ```bash
        npx serve
        ```
    -   If you have Python 3:
        ```bash
        python -m http.server
        ```

3.  **Open the Game:**
    Your terminal will show a local address, usually `http://localhost:3000` or `http://localhost:8000`. Open this URL in your web browser to play the game.

That's it! The application will now run locally. The browser will use the Babel library (included in `index.html`) to compile the code on the fly.
