from flask import Flask, request, render_template


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        f = request.files['file']
        filename = f.filename
        return render_template('index.html', filename=filename)
    return render_template('index.html', filename=None)


if __name__ == "__main__":
    app.run(debug=True)
