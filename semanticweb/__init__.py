from flask import Flask
from firebase_admin import firestore, initialize_app, credentials
from os import environ


environ['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
environ['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:8083'
environ['GOOGLE_APPLICATION_CREDENTIALS'] = './serviceAccountKey.json'
environ['FLASK_ENV'] = 'development'

cred = credentials.ApplicationDefault()
initialize_app(cred)
db = firestore.client()
app = Flask(__name__)

# import ssl
# ssl._create_default_https_context = ssl._create_unverified_context

# avoid circular imports in python
from semanticweb import routes