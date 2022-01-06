from datetime import timedelta
from semanticweb import g
from json import dumps


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


def get_sorted_students_by_test_results(sort_type: str):
    query = """
    SELECT ?personName ?points ?testName
    WHERE {
    ?person foaf:name ?personName .
    ?take a uni:Take .
    ?take uni:points ?points .
    ?take uni:doneBy ?person .
    ?take uni:partOf ?test .
    ?test uni:name ?testName .
    }
    ORDER BY %s(?points) ?personName
    """ % (sort_type)
    return [(row.personName.value, row.points.value, row.testName.value) for row in g.query(query)]


def get_sorted_courses_by_test_results(sort_type: str):
    query = """
    SELECT ?testName ?courseName (avg(?points) as ?avgPoints)
    WHERE {
    ?person foaf:name ?personName .
    ?take a uni:Take .
    ?take uni:points ?points .
    ?take uni:doneBy ?person .
    ?take uni:partOf ?test .
    ?test uni:name ?testName .
    ?test uni:partOf ?course .
    ?course dc:title ?courseName .
    }
    GROUP BY ?testName  ?courseName
    ORDER BY %s(?avgPoints) ?testName
    """ % (sort_type)
    return [(float(row.avgPoints.value), row.courseName.value) for row in g.query(query)]


def get_sorted_tests_by_duration(sort_by: str):
    # get min and max duration for each test
    query = """
    SELECT  ?testName (max(?duration) as ?maxDuration) (min(?duration) as ?minDuration)
    WHERE {
    ?take uni:partOf ?test .
    ?test uni:name ?testName .

    # get duration and take
    {
        SELECT ?take (?endTime - ?startTime as ?duration)
        WHERE {
            ?take a uni:Take .
            ?take uni:startTime ?startTime .
            ?take uni:endTime ?endTime .
        }
    }
    }
    GROUP BY ?testName
    ORDER BY DESC(?%s)
    """ % (sort_by)

    return [{
            'testName': row.testName.value,
            'maxDurationInSec': row.maxDuration.value.total_seconds(),
            'minDurationInSec': row.minDuration.value.total_seconds(),
            } for row in g.query(query)]
