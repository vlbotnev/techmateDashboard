from flask import Flask, request, render_template, Response, jsonify
import requests

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        f = request.files['file']
        filename = f.filename
        return render_template('new-main.html', filename=filename)
    return render_template('new-main.html', filename=None)


@app.route('/mail-upload', methods=['POST'])
def mail_upload():
    f = request.files['file']
    if f:
        api_url = "http://10.88.88.90:2223/upload/"
        try:
            response = requests.post(api_url, files={'file': (f.filename, f.stream, f.content_type)}, timeout=180)
            return Response(response.content, response.status_code, response.headers.items())
        except requests.exceptions.Timeout:
            return 'The API request timed out.', 504
        except requests.exceptions.RequestException as e:
            return str(e), 500
    return 'No file provided', 400


@app.route('/audio-upload', methods=['POST'])
def audio_upload():
    f = request.files['file']
    if f:
        api_url = "http://10.88.88.90:3333/upload/"
        try:
            response = requests.post(api_url, files={'file': (f.filename, f.stream, f.content_type)}, timeout=180)
            return Response(response.content, response.status_code, response.headers.items())
        except requests.exceptions.Timeout:
            return 'The API request timed out.', 504
        except requests.exceptions.RequestException as e:
            return str(e), 500
    return 'No file provided', 400


@app.route('/mail-analysis', methods=['POST'])
def mail_analysis():
    # Получаем JSON данные из запроса
    data = request.get_json()

    # Проверяем, что данные были получены
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Отправляем запрос на внешний API
    try:
        response = requests.post('http://10.88.88.90:1111/requests', json=data)

        # Если запрос успешен, возвращаем ответ
        if response.status_code == 200:
            return jsonify({"status": "success", "data": response.json()}), 200
        else:
            return jsonify({"status": "failed", "reason": response.text}), response.status_code
    except requests.exceptions.RequestException as e:
        # Обработка ошибок при отправке запроса
        return jsonify({"status": "failed", "reason": str(e)}), 500


@app.route('/mail-analysis-check', methods=['POST'])
def mail_analysis_check():
    # Получаем request_id из JSON запроса
    data = request.get_json()
    request_id = data.get('request_id')

    if not request_id:
        return jsonify({"error": "No request_id provided"}), 400

    # Формируем URL для проверки статуса запроса
    url = f'http://10.88.88.90:1111/requests/{request_id}'

    try:
        # Выполняем GET запрос к внешнему API
        response = requests.get(url)

        if response.status_code == 200:
            # Возвращаем ответ от API
            return jsonify(response.json()), 200
        else:
            return jsonify({"status": "failed", "reason": response.text}), response.status_code
    except requests.exceptions.RequestException as e:
        # Обработка ошибок при выполнении запроса
        return jsonify({"status": "failed", "reason": str(e)}), 500


@app.route('/audio-analysis', methods=['POST'])
def audio_analysis():
    # Получаем JSON данные из запроса
    data = request.get_json()

    # Проверяем, что данные были получены
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Отправляем запрос на внешний API
    try:
        response = requests.post('http://10.88.88.90:3333/api/v1/processing', json=data)

        # Если запрос успешен, возвращаем ответ
        if response.status_code == 201:
            return jsonify({"status": "success", "data": response.json()}), 201
        else:
            return jsonify({"status": "failed", "reason": response.text}), response.status_code
    except requests.exceptions.RequestException as e:
        # Обработка ошибок при отправке запроса
        return jsonify({"status": "failed", "reason": str(e)}), 500


@app.route('/audio-analysis-check', methods=['POST'])
def audio_analysis_check():
    # Получаем request_id из JSON запроса
    data = request.get_json()
    request_id = data.get('request_id')

    if not request_id:
        return jsonify({"error": "No request_id provided"}), 400

    # Формируем URL для проверки статуса запроса
    url = f'http://10.88.88.90:3333/api/v1/processing/{request_id}'

    try:
        # Выполняем GET запрос к внешнему API
        response = requests.get(url)

        if response.status_code == 200:
            # Возвращаем ответ от API
            return jsonify(response.json()), 200
        else:
            return jsonify({"status": "failed", "reason": response.text}), response.status_code
    except requests.exceptions.RequestException as e:
        # Обработка ошибок при выполнении запроса
        return jsonify({"status": "failed", "reason": str(e)}), 500


@app.route('/download-excel')
def download_excel():
    file_url = request.args.get('url')
    if not file_url:
        return "No URL provided", 400

    try:
        response = requests.get(file_url, stream=True)

        if response.status_code == 200:
            content_disposition = response.headers.get('Content-Disposition', '')
            filename = 'filename.xlsx'
            if 'filename="' in content_disposition:
                filename = content_disposition.split('filename="')[1].split('"')[0]

            return Response(
                response.iter_content(chunk_size=1024),
                content_type=response.headers['Content-Type'],
                headers={"Content-Disposition": f"attachment; filename=\"{filename}\""}
            )
        else:
            return "Error downloading file from API", response.status_code
    except requests.exceptions.RequestException as e:
        return str(e), 500


if __name__ == "__main__":
    app.run(debug=True)
