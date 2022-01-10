from flask import jsonify, request
from semanticweb import app, db, sparql, Graph
from firebase_admin import auth
from functools import wraps


# allow all origin
@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    return response


def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if not request.headers.get('authorization'):
            return {'message': 'No token provided'}, 400
        try:
            user = auth.verify_id_token(request.headers['authorization'])
            print(user)
            request.user = user
        except:
            return {'message': 'Invalid token provided.'}, 400
        return f(*args, **kwargs)
    return wrap


@app.route('/test-firebase-token')
@check_token
def test_firebase_token():
    return jsonify('token works')


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
    return jsonify([(s, p, o) for s, p, o in g])


@app.route('/test-auth')
def test_auth():
    user: auth.UserRecord
    user = auth.get_user_by_email('jovan@teacher.com')
    print(user.idToken)
    return 'done'


@app.get('/courses')
@check_token
def get_courses():
    return jsonify(sparql.get_all_courses())


@app.get('/programs')
@check_token
def get_programs():
    return jsonify(sparql.get_all_programs())


@app.get('/teachers')
@check_token
def get_teachers():
    return jsonify(sparql.get_all_teachers())


@app.get('/scientific_fields_in_semester')
@check_token
def get_scientific_fields():
    semester = request.args.get('semester')
    return jsonify(sparql.get_scientific_fields(semester))


# Q1
@app.get('/query_teachers_on_course')
@check_token
def query_teachers_on_course():
    course_name = request.args.get('courseName')
    return jsonify(sparql.get_teachers(course_name))


# Q2
@app.get('/query_courses_for_a_given_teacher')
@check_token
def query_courses_for_a_given_teacher():
    teacher_name = request.args.get('teacherName')
    return jsonify(sparql.get_courses(teacher_name))


# Q3
@app.get('/query_courses_with_more_than_3_books')
@check_token
def query_courses_with_more_than_3_books():
    return jsonify(sparql.get_courses_with_more_than_3_books())


# Q4
@app.get('/query_courses_with_espb_and_year')
@check_token
def query_courses_with_espb_and_year():
    espb_limit = int(request.args.get('espbLimit'))
    year = int(request.args.get('year'))
    return jsonify(sparql.get_courses_with_espb_and_year(espb_limit, year))


# Q5
@app.get('/query_courses_with_semester_and_scientific_field')
@check_token
def query_courses_with_semester_and_scientific_field():
    semester = request.args.get('semester')
    scientific_field = request.args.get('scientificField')
    return jsonify(sparql.get_courses_with_semester_and_scientific_field(semester, scientific_field))


# Q6
@app.get('/query_sorted_students_by_test_results')
@check_token
def query_sorted_students_by_test_results():
    sort_type = request.args.get('sort', None)  # expecting asc or desc
    if sort_type != 'DESC':
        sort_type = 'ASC'
    return jsonify(sparql.get_sorted_students_by_test_results(sort_type))


# Q7
@app.get('/query_sorted_courses_by_test_results')
@check_token
def query_sorted_courses_by_test_results():
    sort_type = request.args.get('sort', None)  # expecting asc or desc
    if sort_type != 'DESC':
        sort_type = 'ASC'
    return jsonify(sparql.get_sorted_courses_by_test_results(sort_type))


# Q8
@app.get('/query_sorted_tests_by_duration')
@check_token
def query_sorted_tests_by_duration():
    # expecting minDuration or maxDuration
    sort_by = request.args.get('sort', None)
    if sort_by != 'minDuration':
        sort_by = 'maxDuration'
    return jsonify(sparql.get_sorted_tests_by_duration(sort_by))


# Q9
@app.get('/query_students_on_course')
@check_token
def query_students_on_course():
    cousre_name = request.args.get('courseName')
    return jsonify(sparql.get_students_on_course(cousre_name))


# Q10
@app.get('/query_teachers_on_programme')
@check_token
def query_teachers_on_programme():
    program_name = request.args.get('programName')
    return jsonify(sparql.get_teachers_on_programme(program_name))
