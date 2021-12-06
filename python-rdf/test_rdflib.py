from rdflib import Graph
from time import time
start_time = time()
g = Graph()
g.parse('http://dbpedia.org/resource/WebAssembly')
print(f'took {time() - start_time}')