from rdflib.namespace import DefinedNamespace, Namespace
from rdflib.term import URIRef


class UNI(DefinedNamespace):
    _fail = True

    # classes
    Book : URIRef
    DomainProblem : URIRef
    Evaluation : URIRef
    MyAnswer : URIRef
    Question : URIRef
    Take : URIRef
    Test : URIRef
    
    # properties
    createdBy : URIRef
    doneBy : URIRef
    hasAnswers : URIRef
    hasDomainProblems : URIRef
    hasEvaluation : URIRef
    hasLiterature : URIRef
    hasQuestions : URIRef
    hasTeachers : URIRef
    partOf : URIRef
    activity : URIRef
    answersList : URIRef
    correct : URIRef
    correctAnswers : URIRef
    educationalField : URIRef
    endTime : URIRef
    espb : URIRef
    levelOfStudy : URIRef
    methodology : URIRef
    name : URIRef
    passed : URIRef
    points : URIRef
    possibleAnswers : URIRef
    preExamination : URIRef
    purpose : URIRef
    required : URIRef
    result : URIRef
    scientificField : URIRef
    semester : URIRef
    semesters : URIRef
    startTime : URIRef
    text : URIRef
    title : URIRef
    typeOfTeaching : URIRef
    year : URIRef

    _NS = Namespace("http://www.semanticweb.org/marija/ontologies/2021/university.owl")
