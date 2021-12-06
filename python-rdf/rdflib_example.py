from rdflib import *
bob = URIRef('http://example.org/people/Bob')
linda = BNode()

name = Literal('Bob')
age = Literal(24)
height = Literal(180)

g = Graph()
g.bind('foaf', FOAF)

g.add((bob, RDF.type, FOAF.Person))
g.set((bob, FOAF.name, name))
g.set((bob, FOAF.age, age))
g.add((bob, FOAF.knows, linda))
g.add((linda, RDF.type, FOAF.Person))
g.set((linda, FOAF.name, Literal('LINDA')))

print(g.serialize(), end='\n-----------\n')
print(g.value(bob, FOAF.age))

g.remove((bob, None, None))  # remove all triples about bob
print(g.serialize(), end='\n-----------\n')