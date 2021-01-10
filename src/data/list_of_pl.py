import re
import requests
from bs4 import BeautifulSoup
import pickle

from language import Language

def get_html_content(url):
    r = requests.get("https://en.wikipedia.org" + url)
    return r.text

memo = {}
def get_id(url):
  title = url.split("/")[2]
  if title in memo:
    return memo[title]

  parsed = requests.get("https://en.wikipedia.org/w/api.php?action=query&titles={}&&redirects&format=json".format(title)).json()
  result = int(list(parsed['query']['pages'])[0])
  memo[title] = result
  return result


def get_languages(soup, regex):
    def is_valid(href):
        return href.startswith('/wiki/')\
               and not href.startswith(('/wiki/Category:', '/wiki/Wikipedia:'))\
               and "#" not in href

    box = soup.find(text=regex)
    links = None

    if box is not None:
      links = box.find_next("tr").findChildren("a")
      return [get_id(link['href']) for link in links if is_valid(link['href'])]

    return None

def get_property(soup, regex):
    box = soup.find(text=regex)
    links = None

    if box is not None:
      links = box.find_next("td").findChildren("a")
      return [link['href'] for link in links if "#" not in link['href']]

    return None

def get_bday(soup):
    box = soup.find("span", {"class": "bday"})
    links = None

    if box is not None:
      return box.text

    return None

if __name__ == "__main__":
  html = requests.get("https://en.wikipedia.org/wiki/List_of_programming_languages").text
  soup = BeautifulSoup(html, "html.parser")

  inf_by_regex = 'Influenced by'
  inf_to_regex = re.compile('Influenced$')

  result = {}
  for alpha in soup.find_all("h2")[:-2]:
    for a in alpha.find_next("div").findChildren("a"):
      url = a["href"]

      if "#" in url:
        print ("[SKIP] " + url)
        continue

      title = url.split("/")[2]
      print(title)

      page_id = get_id(url)
      soup = BeautifulSoup(get_html_content(url), "html.parser").find("table", {"class": "infobox"})

      inf_by = None
      inf_to = None
      paradigm = None
      family = None
      typing = None
      appeared = None

      if soup is not None:
        inf_by = get_languages(soup, inf_by_regex)
        inf_to = get_languages(soup, inf_to_regex)
        paradigm = get_property(soup, "Paradigm")

        family = get_property(soup, "Family")
        if family is not None:
          family = list(map(get_id, family))

        typing = get_property(soup, "Typing discipline")
        appeared = get_bday(soup)

      result[page_id] = Language(title, inf_by, inf_to, paradigm, family, typing, appeared)

    with open('src/data/pl.pkl', 'wb') as f:
      pickle.dump(result, f)

