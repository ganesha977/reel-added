from transformers import pipeline

print("Loading image captioning model, please wait...")
caption_generator = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
print("Model loaded successfully!")

def generate_caption(image_path):
    result = caption_generator(image_path)[0]
    return {"caption": result["generated_text"]}
