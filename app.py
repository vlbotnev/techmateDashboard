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
        api_url = 'http://10.88.88.90:3000/upload/'
        try:
            response = requests.post(api_url, files={'file': (f.filename, f.stream, f.content_type)}, timeout=180)
            return Response(response.content, response.status_code, response.headers.items())
        except requests.exceptions.Timeout:
            return 'The API request timed out.', 504
        except requests.exceptions.RequestException as e:
            return str(e), 500
    return 'No file provided', 400


if __name__ == "__main__":
    app.run(debug=True)
