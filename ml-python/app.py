from flask import Flask, request, jsonify
from model import check_toxicity
from model_caption import generate_caption
import os

app = Flask(__name__)

# Toxic comment route
@app.route("/check-comment", methods=["POST"])
def check_comment():
    data = request.json
    comment = data.get("comment", "").strip()
    if not comment:
        return jsonify({"error": "Comment is empty"}), 400
    
    return jsonify(check_toxicity(comment))

# Image caption route
@app.route("/generate-caption", methods=["POST"])
def image_caption():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files["image"]
    os.makedirs("uploads", exist_ok=True)
    image_path = os.path.join("uploads", image.filename)
    image.save(image_path)
    
    return jsonify(generate_caption(image_path))

if __name__ == "__main__":
    app.run(port=5001, debug=True)
