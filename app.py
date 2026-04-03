from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

# Load trained model
model = load_model('model/skin_model.h5')

# IMPORTANT: class names (must match your folders EXACTLY)
classes = [
    'Acne',
    'Actinic_Keratosis',
    'Bullous',
    'DrugEruption',
    'Eczema',
    'Lupus',
    'Psoriasis',
    'Tinea',
    'Unknown_Normal',
    'Vasculitis'
]

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Preprocess image
    img = image.load_img(filepath, target_size=(224,224))
    img_array = image.img_to_array(img)/255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Prediction
    prediction = model.predict(img_array)
    predicted_class = classes[np.argmax(prediction)]
    confidence = float(np.max(prediction)) * 100

    return jsonify({
        "disease": predicted_class,
        "confidence": round(confidence, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)