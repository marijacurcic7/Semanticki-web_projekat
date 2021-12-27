from rdflib.namespace import DefinedNamespace, Namespace
from rdflib.term import URIRef


class University(DefinedNamespace):
    _fail = True

    ESPB: URIRef
    Domain: URIRef
    Field: URIRef
    LevelOfStudy: URIRef
    Semesters: URIRef
    Title: URIRef

    Literature: URIRef

    Evaluation: URIRef
    Activity: URIRef
    PreExamination: URIRef
    Points: URIRef
    Required: URIRef

    Purpose: URIRef
    Methodology: URIRef
    Result: URIRef
    Semester: URIRef
    Year: URIRef
    # CourseESPB: URIRef

    TypeOfTeaching: URIRef

    _NS = Namespace("http://www.semanticweb.org/marija/ontologies/2021/university")
