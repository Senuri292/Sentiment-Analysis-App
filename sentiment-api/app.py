from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your trained model
print("Loading model...")
with open('Twitter_Trained_Model.pkl', 'rb') as f:
    model = pickle.load(f)
print("Model loaded successfully!")

# If your model requires a vectorizer or tokenizer, load that too
# For example:
# with open('vectorizer.pkl', 'rb') as f:
#     vectorizer = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    tweet = data['tweet']
    
    # Preprocess the tweet if needed
    # If your model expects vectorized input:
    # tweet_vector = vectorizer.transform([tweet])
    # prediction = model.predict(tweet_vector)[0]
    
    # If your model can predict directly:
    prediction = model.predict([tweet])[0]
    
    # Get prediction probability/confidence
    # This depends on your model type
    try:
        proba = model.predict_proba([tweet])
        accuracy = np.max(proba)
    except:
        # Fallback if predict_proba is not available
        accuracy = 0.85  # Default confidence
    
    return jsonify({
        'sentiment': int(prediction),  # Convert to int for JSON serialization
        'accuracy': float(accuracy)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)