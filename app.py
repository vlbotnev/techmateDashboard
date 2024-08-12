from flask import Flask, request, render_template, Response
import requests

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        f = request.files['file']
        filename = f.filename
        return render_template('index.html', filename=filename)
    return render_template('index.html', filename=None)


@app.route('/start-analysis', methods=['POST'])
def start_analysis():
    f = request.files['file']
    if f:
        # URL удаленного API, куда будет отправлен файл
        api_url = 'http://10.88.88.90:3000/upload/'
        # Отправляем файл на удаленное API
        response = requests.post(api_url, files={'file': (f.filename, f.stream, f.content_type)})
        # Возвращаем ответ API, как есть
        return Response(response.content, response.status_code, response.headers.items())
    return "no file provided"


if __name__ == "__main__":
    app.run(debug=True)
