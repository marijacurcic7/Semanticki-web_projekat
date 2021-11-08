from flask import jsonify
from semanticweb import app, db
from rdflib import Graph

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
    return 'true'
    # return jsonify([(s, p, o) for s, p, o in g])
