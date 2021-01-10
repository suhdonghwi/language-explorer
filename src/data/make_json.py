from urllib.parse import unquote
from language import Language
import pickle
import json

data = None
with open('src/data/pl.pkl', 'rb') as f:
  data = pickle.load(f)

nodes = []
edges = []

edge_id = 0

def pretty_label(title):
  title = unquote(title)
  title = title.replace("_", " ").replace("(programming language)", "").strip()
  return title

for key, value in data.items():
  lang_id = str(key)
  nodes.append({'id': lang_id, 'label': pretty_label(value.title)})

for key, value in data.items():
  lang_id = str(key)

  if value.inf_by is not None:
    for by_lang_id in value.inf_by:
      if by_lang_id in data.keys():
        edges.append({'id': str(edge_id), 'source': str(by_lang_id), 'target': lang_id})
        edge_id += 1

  if value.inf_to is not None:
    for to_lang_id in value.inf_to:
      if to_lang_id in data.keys():
        edges.append({'id': str(edge_id), 'target': str(to_lang_id), 'source': lang_id})
        edge_id += 1

result = {'nodes': nodes, 'edges': edges}

with open('./graph.json', 'w') as f:
  json.dump(result, f)
