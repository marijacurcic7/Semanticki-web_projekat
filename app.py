from flask import Flask, jsonify
from firebase_admin import firestore, initialize_app, credentials
from rdflib import Graph
from os import environ

import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def set_env_var():
    environ['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
    environ['GOOGLE_APPLICATION_CREDENTIALS'] = './serviceAccountKey.json'


environ['FLASK_ENV'] = 'development'
app = Flask(__name__)


@app.route('/')
def main():
    temp = 'world'
    return 'hello ' + temp


@app.route('/test-firestore')
def test_firestore():
    users_ref = db.collection(u'users')
    docs = users_ref.stream()
    users = ''
    users_arr = []
    for doc in docs:
        users += '<p>' + (f'{doc.id} => {doc.to_dict()}') + '</p>'
        users_arr.append(doc.to_dict())
    # return users
    return jsonify(users_arr)


@app.route('/test-rdflib')
def test_rdflib():
    g = Graph()
    g.parse('http://dbpedia.org/resource/WebAssembly')

    # for s, p, o in g:
        # print(s, p, o)

    return jsonify([(s, p, o) for s, p, o in g])
    # return 'True'


if __name__ == '__main__':
    set_env_var()
    cred = credentials.ApplicationDefault()
    initialize_app(cred)
    db = firestore.client()
    app.run(debug=True)
