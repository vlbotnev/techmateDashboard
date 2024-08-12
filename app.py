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
