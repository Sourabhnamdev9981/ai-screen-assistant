ai-screen-assistant/
│
├── frontend/           # React app
│   └── src/
│       └── components/
│       └── hooks/
│       └── App.jsx
│
├── backend/            # FastAPI app
│   └── app/
│       └── main.py
│       └── ocr.py
│       └── groq_api.py
│
├── shared/             # (Optional) shared interface files
├── README.md
└── requirements.txt    # Backend dependencies






# Step 1: Set up frontend (React)
npx create-react-app frontend

# Step 2: Set up backend (FastAPI)
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install fastapi uvicorn python-multipart pillow pytesseract
pip freeze > requirements.txt



touch app/main.py
mkdir app
touch app/ocr.py
touch app/groq_api.py




# 📁 Folder Structure Inside frontend/src
src/
├── components/
│   └── ScreenCapturePreview.jsx
├── hooks/
│   └── useScreenCapturer.js
└── App.jsx


# 🧠 useScreenCapturer.js – Core Screen Logic (Hook)

// src/hooks/useScreenCapturer.js
import { useState, useRef } from "react";

export function useScreenCapturer() {
  const [screenshots, setScreenshots] = useState([]);
  const videoRef = useRef(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      videoRef.current.srcObject = stream;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const frames = [];

      let frameCount = 0;
      const captureInterval = setInterval(() => {
        if (frameCount >= 6) {
          clearInterval(captureInterval);
          stream.getTracks().forEach((track) => track.stop());
          setScreenshots(frames);
          return;
        }

        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        frames.push(imageData);
        frameCount++;
      }, 5000);
    } catch (err) {
      console.error("Error starting screen capture", err);
    }
  };

  return { videoRef, screenshots, startCapture };
}



# 🎥 ScreenCapturePreview.jsx – Show the Screenshots
// src/components/ScreenCapturePreview.jsx
export default function ScreenCapturePreview({ screenshots }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {screenshots.map((src, i) => (
        <img key={i} src={src} alt={`screenshot-${i}`} className="rounded shadow" />
      ))}
    </div>
  );
}



# 🚀 App.jsx – Main App File

// src/App.jsx
import { useScreenCapturer } from "./hooks/useScreenCapturer";
import ScreenCapturePreview from "./components/ScreenCapturePreview";

function App() {
  const { videoRef, screenshots, startCapture } = useScreenCapturer();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Screen Assistant</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={startCapture}
      >
        Start Screen Assistant
      </button>

      {/* Hidden video used for canvas drawing */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: "none" }}
      />

      <ScreenCapturePreview screenshots={screenshots} />
    </div>
  );
}

export default App;




# 🧪 Test It
Run your React app with:

cd frontend
npm start
Click “Start Screen Assistant”

Wait ~30 seconds (6 screenshots, one every 5 seconds)

You should see the captured screenshots appear!



frontend/src/index.js
# ✅ index.js


// frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // optional: create this for styling if you want

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


frontend/public/index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>AI Screen Assistant</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>





✅ Files You’ll Work In:

backend/
├── app/
│   ├── main.py          ← API entrypoint
│   ├── ocr.py           ← OCR + text cleaning
│   ├── groq_api.py      ← Send prompt to Groq



# 📥 Step 3.1 — main.py (FastAPI Endpoint)

# backend/app/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.ocr import process_images_to_text
from app.groq_api import ask_groq
from typing import List
import base64
from io import BytesIO
from PIL import Image

app = FastAPI()

# Allow local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_images(images: List[str]):
    extracted_text = []

    for img_base64 in images:
        try:
            header, encoded = img_base64.split(",", 1)
            img_data = base64.b64decode(encoded)
            image = Image.open(BytesIO(img_data))
            text = process_images_to_text(image)
            extracted_text.append(text)
        except Exception as e:
            print("Error processing image:", e)

    full_text = "\n".join(extracted_text)
    response = ask_groq(full_text)
    return {"text": full_text, "groq_response": response}



# 🔍 Step 3.2 — ocr.py (OCR + Cleanup)
python
Copy
Edit
# backend/app/ocr.py
import pytesseract

def process_images_to_text(image):
    raw_text = pytesseract.image_to_string(image)

    # Basic cleanup
    lines = raw_text.split("\n")
    cleaned = []
    seen = set()
    for line in lines:
        line = line.strip()
        if not line or line.lower() in seen:
            continue
        if any(keyword in line.lower() for keyword in ["click", "button", "close"]):
            continue
        if line not in seen:
            seen.add(line.lower())
            cleaned.append(line)

    return "\n".join(cleaned)



# 🤖 Step 3.3 — groq_api.py (Groq Integration Placeholder)
python
Copy
Edit
# backend/app/groq_api.py
import os

def ask_groq(prompt: str) -> str:
    # Replace this with real Groq API call
    # For now, mock a fast fake response
    return f"[Groq Suggestion]: {prompt[:200]}..."




    pip install python-dotenv groq



    # backend/app/groq_api.py
import os
from dotenv import load_dotenv
from groq import Groq  # Make sure you have the Groq Python client installed

# Load environment variables from .env file
load_dotenv()

def ask_groq(prompt: str) -> str:
    # Initialize Groq client with API key
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    try:
        # Create chat completion
        chat_completion = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": prompt
            }],
            model="mixtral-8x7b-32768"  # or other supported model
        )
        
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        return f"Error accessing Groq API: {str(e)}"


        GROQ_API_KEY=your_actual_api_key_here


.\venv\Scripts\Activate    

        # From inside backend/
uvicorn app.main:app --reload

✅ File: useAnalyzeScreenshots.js
Create this inside:

bash
Copy
Edit
frontend/src/hooks/useAnalyzeScreenshots.js
jsx
Copy
Edit
// frontend/src/hooks/useAnalyzeScreenshots.js
import { useState } from "react";

export default function useAnalyzeScreenshots() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async (screenshots) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: screenshots }),
      });

      if (!res.ok) throw new Error("Failed to analyze screenshots");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { analyze, result, loading, error };
}


💡 How to Use This Hook (Preview)
In any component:

jsx
Copy
Edit
const { analyze, result, loading, error } = useAnalyzeScreenshots();

const handleAnalyzeClick = () => {
  analyze(capturedScreenshots); // capturedScreenshots = base64 array
};

{loading && <p>Analyzing...</p>}
{result && <p>{result.groq_response}</p>}
{error && <p>Error: {error}</p>}


🧩 In your component (e.g., ScreenAssistant.js):
Here’s how it should look:

jsx
Copy
Edit
import React from "react";
import useScreenCapturer from "../hooks/useScreenCapturer";
import useAnalyzeScreenshots from "../hooks/useAnalyzeScreenshots";

export default function ScreenAssistant() {
  const { startCapture, screenshots } = useScreenCapturer();
  const { analyze, result, loading, error } = useAnalyzeScreenshots();

  const handleStart = async () => {
    await startCapture(); // Starts screen sharing + captures frames
  };

  const handleAnalyze = () => {
    if (screenshots.length > 0) {
      analyze(screenshots);
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleStart} className="btn btn-primary">Start Capture</button>
      <button onClick={handleAnalyze} className="btn btn-success ml-2">Analyze</button>

      {loading && <p>🧠 Analyzing screenshots...</p>}
      {error && <p className="text-red-600">❌ Error: {error}</p>}
      {result && (
        <div className="mt-4">
          <h3>📝 Extracted Text</h3>
          <pre>{result.text}</pre>

          <h3 className="mt-2">💡 Groq Suggestion</h3>
          <p>{result.groq_response}</p>
        </div>
      )}
    </div>
  );
}
