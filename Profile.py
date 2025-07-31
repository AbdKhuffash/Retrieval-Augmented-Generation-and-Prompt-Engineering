from flask import Flask, request, jsonify
import os
import requests

# Create Flask app
app = Flask(__name__)

# Bypass proxy for localhost
os.environ['NO_PROXY'] = 'localhost,127.0.0.1'

@app.route('/answer', methods=['POST'])
def answer():
    data = request.get_json()
    question = data.get('question')
    document = data.get('document')  # Plain text of the document

    if not question or not document:
        return jsonify({"error": "Missing 'question' or 'document' field"}), 400

    # Construct the prompt for the Ollama model
    prompt = (
        "You are a helpful assistant. "
        "Answer the question based on the given document text. "
        "Provide a concise and precise answer, starting with the prefix 'Answer:'.\n\n"
        f"Document:\n{document}\n\n"
        f"Question: {question}\n\n"
        "Answer:"
    )

    payload = {
        "model": "gemma3:27b", 
        "prompt": prompt,
        "stream": False
    }

    # Send request to the Ollama API
    response = requests.post("http://localhost:11434/api/generate", json=payload)
    if response.status_code == 200:
        return jsonify({"answer": response.json().get('response')})
    else:
        return jsonify({"error": "Failed to generate answer", "details": response.text}), response.status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7111, debug=True)
