import gradio as gr
from ocr import process_image  # Example function
from app.cleaner import clean_text  # Optional

def analyze(image):
    raw_text = process_image(image)
    cleaned = clean_text(raw_text)
    return cleaned

interface = gr.Interface(
    fn=analyze,
    inputs=gr.Image(type="filepath"),
    outputs="text",
    title="AI Medical Assistant",
    description="Upload an image, and the AI will process it."
)

if __name__ == "__main__":
    interface.launch(share=True)  # share=True gives public link
