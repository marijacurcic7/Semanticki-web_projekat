from flask import Flask
from firebase_admin import firestore, initialize_app, credentials
from os import environ
from rdflib import Graph
from owlrl import DeductiveClosure, OWLRL_Semantics

environ['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
environ['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:8083'
environ['GOOGLE_APPLICATION_CREDENTIALS'] = '../serviceAccountKey.json'
environ['FLASK_ENV'] = 'development'

cred = credentials.ApplicationDefault()
initialize_app(cred)
db = firestore.client()
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# load RDF data from uni.ttl
g = Graph()
g.parse('../python-rdf/uni.ttl')
# load ontology
g.parse('../ontologije/university_ontology.ttl')
# turn on reasoner
DeductiveClosure(OWLRL_Semantics).expand(g)

# avoid circular imports in python
from semanticweb import routes