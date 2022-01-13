# Semantic Web In E-learning
![](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/%20-Puppeteer-40B5A4?style=for-the-badge&logo=Puppeteer&logoColor=white)
![](https://img.shields.io/badge/Angular-E23237?style=for-the-badge&logo=angular&logoColor=white)

## The goal 
The goal of this project was integrate Semantic Web Stack technologies into aspects of E-learning system. We used existing standards like: Dublin Core, FOAF, AIISO. 
We also had to create ontology for our specific needs.

### Semantic Web Stack
<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Semantic_web_stack.svg/405px-Semantic_web_stack.svg.png'/>

## Development Process
- Backend microservice initialization using Flask
- Found Triple store for python -  [rdflib](https://github.com/RDFLib/rdflib)
- Scrapped neccessary data from the university website
- Found ontologies & created the new one
- Populated rdf data
- Created SPARQL queries
- Turned on reasoning
- Created endpoints for SRARQL queries
- Created frontend to demonstrate queries

## Detailed Description
We expanded our own E-learning data (teachers, students, courses, tests,...) using technologies from semantic web. This data is contained in the [data](./data) folder. This data also containes scrapped data from the university website. Data folder can be loaded into Firebase Firestore database.
The whole project is structed in 5 sections.
The actual aplication has frontend written in Angular and backend microservice written in Flask.

### Front
In the [front](./front) folder we have Angular application which demonstrates all that has been done. After login, user can query results and show full advantage of semantic web and ontologies. 

### Backend
In the [server](./server) folder we have Flask application which has endpoints to demonstrate SPARQL queries.

### Scraping
Scraping was done using [Puppeteer](https://github.com/puppeteer/puppeteer), which is a Node library providing high-level API to control Chrome (and Chromium). Scrapped data about courses, teachers, courses, descriptions,... was saved into firestore database.

### Our Ontology & Data
Our ontology is provided in the [folder](./ontologije). Our ontology has also python support in the [file](./python-rdf/Uni.py). In the [python-rdf folder](./python-rdf) we have main Python Notebook which will take data from the firestore database and save it to a [file](./python-rdf/uni.ttl). This file contains all the data. (This file is used by backend when sparql queries are created.) 

### SPARQL
In order to perform queries, one must have the data on which queries are performed. This data is contained in previous mentioned [file](./python-rdf/uni.ttl). 
First, we load the data and then perform queries. All queries are found in in the backend, but easier way to understand them is to look at the [sparql folder](./python-rdf/sparql).

#### Reasoner
Reasoner is very important in the Semantic Web Stack. Reasoner is turned on in the backend Flask microservice. A couple of examples how reasoner can be handy is provided in the [reaser folder](./python-rdf/reasoner). There is shown how one can reason on 3 different ontologies and how powerfull semantic web is.

<hr>

#### References
- https://flask.palletsprojects.com/en/2.0.x/
- https://angular.io/
- https://firebase.google.com/
- https://firebase.google.com/docs/emulator-suite/install_and_configure
- https://firebase.google.com/docs/firestore
- https://rdflib.readthedocs.io/en/stable/
- https://owl-rl.readthedocs.io/en/latest/
- https://github.com/puppeteer/puppeteer

#### Run Application
- To run firebase: `firebase emulators:start --export-on-exit=../data --import=../data`
- To run angular from front folder: `ng serve -o`
- To run flask fron server folder: `python app.py` 