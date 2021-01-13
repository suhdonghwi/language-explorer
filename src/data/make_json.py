from urllib.parse import unquote
from language import Language
import pickle
import json
import re

data = None
with open('src/data/pl.pkl', 'rb') as f:
    data = pickle.load(f)

nodes = []
edges = []

edge_id = 0


def pretty_label(title):
    title = unquote(title)
    title = title.replace("_", " ").replace(
        "(programming language)", "").strip()
    return title


def normalize_typing(s):
    if s in ["type inference", "partially inferred"]:
        return ["inferred"]
    elif s in ["static and dynamic", "static, with dynamic features"]:
        return ["static", "dynamic"]
    elif s in ["word", "typeless"]:
        return ["untyped"]
    elif "," in s:
        return s.split(", ")
    else:
        return [re.sub(r"typing$", "", s).strip()]


def normalize_paradigm(s):
    if s.startswith("multi"):
        return ["multi paradigm"]
    elif s.startswith("prototype"):
        return ["prototype based"]
    elif s == "non structured":
        return ["unstructured"]
    elif s == "scripting language":
        return ["scripting"]
    elif s == "exp oriented":
        return ["expression oriented"]
    elif s == "purely functional":
        return ["functional"]
    elif "," in s:
        return s.split(", ")
    elif s in ["dependent typed", "typed language", "algebraic types"]:
        return []
    else:
        return [re.sub(r"programming$|paradigm$", "", s).strip()]


for key, value in data.items():
    lang_id = str(key)
    node = {'id': lang_id, 'label': pretty_label(value.title)}

    if value.paradigm is not None and len(value.paradigm) > 0:
        paradigm = []
        for p in value.paradigm:
            paradigm.extend(normalize_paradigm(p))

        node['paradigm'] = paradigm

    if value.typing is not None and len(value.typing) > 0:
        typing = []
        for t in value.typing:
            typing.extend(normalize_typing(t))

        node['typing'] = typing

    if value.appeared is not None:
        node['appeared'] = value.appeared

    if value.website is not None:
        node['website'] = value.website

    nodes.append(node)


for key, value in data.items():
    lang_id = str(key)

    if value.inf_by is not None:
        for by_lang_id in value.inf_by:
            if by_lang_id in data.keys():
                edges.append({'id': str(edge_id), 'source': str(
                    by_lang_id), 'target': lang_id})
                edge_id += 1

    if value.inf_to is not None:
        for to_lang_id in value.inf_to:
            if to_lang_id in data.keys():
                edges.append({'id': str(edge_id), 'target': str(
                    to_lang_id), 'source': lang_id})
                edge_id += 1

result = {'nodes': nodes, 'edges': edges}

with open('./src/data/graph.json', 'w') as f:
    json.dump(result, f)
