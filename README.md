# 🌎 language-explorer

Explore 650+ programming languages, visualized based on paradigm influence relationships between languages.

<p style="text-align: center">
<img src="https://user-images.githubusercontent.com/8275026/104386780-2845d100-5579-11eb-9ad7-b8748a2cd9bc.png"/>
</p>

## Feature

- [x] View paradigm influence relationships (by, to) between programmiing languages
- [x] View typing discipline, paradigm, appeared date, and website url data of a language
- [x] Search by language name
- [x] Highlight nodes by selecting paradigms or typing disciplines
- [ ] Analyze relationships between two languages
- [ ] View how a language spreaded paradigm over time
- [ ] Sort nodes by appeared date
- [ ] Mobile devices support

## Data source

Programming language documents in wikipedia contain "influenced by" and "influenced" section in an information box. Using this information, we could collect paradigm influence relationships data. I crawled and analyzed programming language documents in wikipedia, and made a directed graph network visualization.
