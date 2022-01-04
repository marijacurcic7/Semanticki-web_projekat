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


@app.get('/courses')
def get_courses():
    return jsonify(sparql.get_all_courses())


@app.get('/query_teachers_on_course')
def query_teachers_on_course():
    course_name = request.args.get('courseName')
    return jsonify(sparql.get_teachers(course_name))


@app.get('/teachers')
def get_teachers():
    return jsonify(sparql.get_all_teachers())


@app.get('/query_courses_for_a_given_teacher')
def query_courses_for_a_given_teacher():
    teacher_name = request.args.get('teacherName')
    return jsonify(sparql.get_courses(teacher_name))
