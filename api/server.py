from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from utility_functions import *

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes and origins


@app.route('/', methods=['GET'])
def server_up():
    return jsonify({'message': 'Server is up!'})


@app.route('/api/upload', methods=['GET'])
def get_data(req):
    print(req)
    # Example data to send
    data = {"message": "Hello from Flask!"}
    return jsonify(data)


@app.route('/api/upload', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file in the request!"}), 400
        
    print(request.data)
    file = request.files['file']
    if file:
        print('[.] File recieved.')
    attributes = json.loads(request.form["attributes"])  # Parse JSON
    y_true = attributes.get("y_true")
    y_pred = attributes.get("y_pred")
    class_names = attributes.get("class_names").split(',')
    positive_class = attributes.get("positive_class").strip()

    # convert file to dataFrame
    df = read_csv_data(file)

    # Covnert None to string None
    for col in [y_true, y_pred]:
        df.replace({col.strip(): {None: 'None'} }, inplace=True)
        df[col] = convert_to_scalar(df[col], positive_class)

    # Process the file as needed
    return jsonify({"metrics": eval_metrics((df[y_true]), df[y_pred]) , "message": f"File '{file.filename}' uploaded successfully!"})


if __name__ == '__main__':
    app.run(debug=True)