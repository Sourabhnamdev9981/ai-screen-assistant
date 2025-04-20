# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.ocr import process_images_to_text
from app.groq_api import ask_groq
from typing import List
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image
from app.cleaner import clean_ocr_text  # ✅ import this
from app.schemas import ImagePayload


app = FastAPI()

# ✅ Allow frontend on localhost:3000 to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Optional root route
@app.get("/")
def root():
    return {"message": "AI Screen Assistant Backend Running"}

@app.post("/chat")
def get_ai_response(data: dict):
    prompt = data.get("prompt", "")
    response = ask_groq(prompt)  # Using the imported ask_groq function
    return {"response": response}


# ✅ Use Pydantic model to match request body structure
class ImagePayload(BaseModel):
    images: List[str]
@app.post("/analyze")
async def analyze_images(payload: ImagePayload):
    extracted_text = []

    for img_base64 in payload.images:
        try:
            header, encoded = img_base64.split(",", 1)
            img_data = base64.b64decode(encoded)
            image = Image.open(BytesIO(img_data))
            raw_text = process_images_to_text(image)
            cleaned = clean_ocr_text(raw_text)  # ✅ Cleaner here
            extracted_text.append(cleaned)
        except Exception as e:
            print("Error processing image:", e)

    full_text = "\n".join(extracted_text)
    response = ask_groq(full_text)

    return {
        "ocr_text": full_text,
        "groq_response": response
    }

# # backend/app/main.py

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.ocr import process_images_to_text
# from app.groq_api import ask_groq
# from typing import List
# import base64
# from io import BytesIO
# from PIL import Image

# app = FastAPI()

# # ✅ Enable CORS so frontend at localhost:3000 can access backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ✅ Health check route (optional)
# @app.get("/")
# def root():
#     return {"message": "AI Screen Assistant Backend Running"}

# # ✅ Analyze route — accepts base64 image list, runs OCR, sends to Groq
# @app.post("/analyze")
# async def analyze_images(images: List[str]):
#     extracted_text = []

#     for img_base64 in images:
#         try:
#             # Decode base64 image
#             header, encoded = img_base64.split(",", 1)
#             img_data = base64.b64decode(encoded)
#             image = Image.open(BytesIO(img_data))

#             # Run OCR and clean the text
#             text = process_images_to_text(image)
#             extracted_text.append(text)

#         except Exception as e:
#             print("Error processing image:", e)
#             # Optional: return error for the user instead of silent fail
#             # return {"error": f"Failed to process image: {str(e)}"}

#     # Combine all extracted text
#     full_text = "\n".join(extracted_text)

#     # Send cleaned text to Groq
#     response = ask_groq(full_text)

#     # Return combined text + Groq suggestion
#     return {
#         "text": full_text,
#         "groq_response": response
#     }

