from flask import Flask

app = Flask(__name__)

@app.route('/')
def main():
  temp = 'world'
  return 'hello ' + temp

def set_env_var():
  from os import environ
  environ['FIRESTORE_EMULATOR_HOST']='localhost:8080'
  environ['GOOGLE_APPLICATION_CREDENTIALS']='./serviceAccountKey.json'

@app.route('/test-firestore')
def test_firestore():
  from firebase_admin import firestore, initialize_app, credentials
  set_env_var()
  cred = credentials.ApplicationDefault()
  initialize_app(cred)
  db = firestore.client()

  users_ref = db.collection(u'users')
  docs = users_ref.stream()

  users = ''
  for doc in docs:
      users += '<p>' + (f'{doc.id} => {doc.to_dict()}') + '</p>'
  return users