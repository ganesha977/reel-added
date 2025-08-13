from transformers import pipeline

print("Loading toxic comment model, please wait...")
toxic_detector = pipeline("text-classification", model="unitary/toxic-bert", tokenizer="unitary/toxic-bert")
print("Model loaded successfully!")

def check_toxicity(comment):
    result = toxic_detector(comment)[0]  # Single comment ka result
    label = result['label']
    score = result['score']
    return {
        "label": label,
        "score": float(score)
    }
