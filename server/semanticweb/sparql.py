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
    ?course uni:hasTeachers ?person .
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
    SELECT DISTINCT ?title ?type ?methodology ?purpose ?result ?semester ?year ?espb
    WHERE {
    ?course a aiiso:Course .
    ?course uni:hasTeachers ?person .
    ?person foaf:name '%s' .
    ?course dc:title ?title .
    OPTIONAL { ?course dc:type ?type . }
    OPTIONAL { ?course uni:methodology ?methodology . }
    OPTIONAL { ?course uni:purpose ?purpose . }
    OPTIONAL { ?course uni:result ?result . }
    OPTIONAL { ?course uni:semester ?semester . }
    OPTIONAL { ?course uni:year ?year . }
    OPTIONAL { ?course uni:espb ?espb . }
    }
    """ % (teacher_name)

    return [row for row in g.query(query)]


def get_courses_with_more_than_3_books():
    query = """
    SELECT ?courseTitle (count(?book) as ?bookCount)
    WHERE {
    ?course a aiiso:Course .
    ?course dc:title ?courseTitle .
    ?course uni:hasLiterature ?book .
    ?book dc:title ?bookTitle .
    }
    GROUP BY ?courseTitle
    HAVING (count(?book) > 3)
    """
    return [{'courseTitle': row.courseTitle.value, 'bookCount': row.bookCount.value} for row in g.query(query)]


def get_courses_with_espb_and_year(espb_limit, current_year):
    query = """
    SELECT ?courseTitle ?year ?espb
    WHERE {
    ?course a aiiso:Course .
    ?course dc:title ?courseTitle .
    ?course uni:espb ?espb .
    ?course uni:year ?year .
    FILTER (?espb > %d) .
    FILTER (?year = %d) .
    }
    GROUP BY ?courseTitle
    """ % (espb_limit, current_year)
    return [{'courseTitle': row.courseTitle.value, 'year': row.year.value, 'espb': row.espb.value} for row in g.query(query)]


def get_scientific_fields(semester):
    query = """
    SELECT ?scientificField
    WHERE {
    ?course a aiiso:Course .
    ?course uni:semester '%s' .
    ?course uni:scientificField ?scientificField .
    }
    """ % (semester)
    return [row.scientificField.value for row in g.query(query)]


def get_courses_with_semester_and_scientific_field(semester, scientific_field):
    query = """
    SELECT ?courseTitle
    WHERE {
    ?course a aiiso:Course .
    ?course dc:title ?courseTitle .
    ?course uni:semester '%s' .
    ?course uni:scientificField '%s'.
    }
    GROUP BY ?courseTitle
    """ % (semester, scientific_field)
    return [row.courseTitle.value for row in g.query(query)]
