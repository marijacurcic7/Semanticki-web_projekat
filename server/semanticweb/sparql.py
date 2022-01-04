from semanticweb import g

def get_courses():
    query = """
    SELECT DISTINCT ?name
    WHERE {
    ?course a aiiso:Course .
    ?course dc:title ?name .
    }
    """
    result = g.query(query)
    courses = [row.name.value for row in result]
    return courses

def get_teachers(course_name):
    query = """
    SELECT DISTINCT ?name
    WHERE {
    ?course a aiiso:Course .
    ?course dc:title ?courseName .
    ?course uni:hasTeachers ?teachers .
    ?teachers uni:teachersList ?person .
    ?person foaf:title ?title .
    ?person foaf:name ?name .
    FILTER (?courseName='%s') .
    FILTER regex(?title, "profesor") .
    }
    """ % (course_name)
    result = g.query(query)
    teachers = [row.name.value for row in result]
    return teachers