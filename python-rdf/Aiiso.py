from rdflib.namespace import DefinedNamespace, Namespace
from rdflib.term import URIRef


class Aiiso(DefinedNamespace):
    _fail = True

    Course: URIRef  # A Course is a KnowledgeGrouping that represents a cohesive collection of educational material referred to by the owning organization as a course

    _NS = Namespace("http://purl.org/vocab/aiiso/schema#")
