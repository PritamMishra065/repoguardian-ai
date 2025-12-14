import os
import requests
from groq import Groq

def ask_ai(prompt):
    # Check for Groq API KEY used in production/cloud
    api_key = os.getenv("GROQ_API_KEY")
    
    if api_key:
        try:
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="mixtral-8x7b-32768",
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}. Falling back to Ollama if available...")
            # Fallthrough to Ollama
            pass

    # Default: Local Ollama
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False
            }
        )
        if response.status_code == 200:
            return response.json()["response"]
        else:
            return f"Error: Ollama failed with status {response.status_code}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to any AI provider. Set GROQ_API_KEY or ensure Ollama is running."
