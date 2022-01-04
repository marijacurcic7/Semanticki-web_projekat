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