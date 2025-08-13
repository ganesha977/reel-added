from flask import Flask, request, jsonify
from model_caption import generate_caption
import os

app = Flask(__name__)

@app.route("/generate-caption", methods=["POST"])
def generate_caption_api():
    if 'image' not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    image_file = request.files['image']
    file_path = os.path.join("uploads", image_file.filename)
    os.makedirs("uploads", exist_ok=True)
    image_file.save(file_path)

    result = generate_caption(file_path)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5002, debug=True)
