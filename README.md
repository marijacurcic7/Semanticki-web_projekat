# Semanticki-web---projekat

## Init
- `cd service`
- `python3 -m venv .venv`. 
***Note for apple silicon*** `python3-intel64 -m venv .venv`. Some libraries do not support Apple chip, and cannot be run. Must use it as Intel chip, hence python3-intel64 command when creating virtual env.
- `source .venv/bin/activate`
- `pip install firebase-admin flask`
- `python3 -m flask run`