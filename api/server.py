from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def server_up():
    return jsonify({'message': 'Server is up!'})

if __name__ == '__main__':
    app.run(debug=True)