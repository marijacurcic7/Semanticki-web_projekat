from semanticweb import g


def get_all_courses():
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


def get_all_teachers():
    query = """
    SELECT DISTINCT ?name
    WHERE {
    ?person foaf:name ?name .
    ?person foaf:title ?title .
    FILTER  regex(?title, "profesor")
    }
    """
    result = g.query(query)
    teachers = [row.name.value for row in result]
    return teachers


def get_courses(teacher_name):
    query = """
    SELECT DISTINCT ?title
    WHERE {
    ?course a aiiso:Course .
    ?course dc:title ?title .
    ?course uni:hasTeachers ?teachers .
    ?teachers uni:teachersList ?person .
    ?person foaf:name '%s' .  
    }
    """ % (teacher_name)

    return [row.title.value for row in g.query(query)]
