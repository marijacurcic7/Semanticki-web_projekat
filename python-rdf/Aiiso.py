from rdflib.namespace import DefinedNamespace, Namespace
from rdflib.term import URIRef


class Aiiso(DefinedNamespace):
    _fail = True

    Programme: URIRef  # A Programme is a KnowledgeGrouping that represents a cohesive collection of educational material referred to by the owning organization as a programme
    Module: URIRef  # A Module is a KnowledgeGrouping that represents a cohesive collection of educational material referred to by the owning organization as a module
    Course: URIRef  # A Course is a KnowledgeGrouping that represents a cohesive collection of educational material referred to by the owning organization as a course
    Teaches: URIRef # An organization may specify the Knowledge Groupings that it teaches using this property
    Department: URIRef  # A Department is a group of people recognised by an organization as forming a cohesive group referred to by the organization as a department


    _NS = Namespace("http://purl.org/vocab/aiiso/schema#")
