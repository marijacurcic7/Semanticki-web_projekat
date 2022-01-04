from flask import jsonify, request
from semanticweb import app, db, sparql
from firebase_admin import auth


# allow all origin
@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    return response


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
    # return 'true'
    return jsonify([(s, p, o) for s, p, o in g])


@app.route('/test-auth')
def test_auth():
    user = auth.get_user_by_email('jovan@teacher.com')
    print(user)
    return 'done'


@app.get('/get-courses')
def get_courses():
    return jsonify(sparql.get_courses())


@app.get('/get-teachers')
def get_teachers():
    course_name = request.args.get('courseName')
    return jsonify(sparql.get_teachers(course_name))
