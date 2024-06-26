from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI

# Загрузка переменных среды из файла .env
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        text = data['text']

        client = OpenAI(
            api_key = os.getenv("OPENAI_API_KEY"),
        )

        # Генерация аннотации с помощью OpenAI API
        response = client.chat.completions.create( # Change the method
            model = "gpt-3.5-turbo",
            messages = [ # Change the prompt parameter to messages parameter
                {"role": "system", "content": (
                    f"Верни мне ответ в виде:\n"
                    f"1. Цель и задачи работы:\n"
                    f"2. Объект и предмет исследования:\n"
                    f"3. Методы исследования:\n"
                    f"4. Результаты исследования:\n"
                    f"5. Научная новизна и практическая значимость:\n"
                    f"6. Область применения:\n"
                    f"7. Объем работы:\n"
                    f"Сам текст:\n\n{text}\n\n"
                )},
            ]
        ) 
        summary = response.choices[0].message.content.strip()

        return jsonify({'summary': summary})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)