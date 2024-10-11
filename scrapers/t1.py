import json
from bs4 import BeautifulSoup
import re

def parse_definition(definition):
    tags = ['obsolete', 'figurative', 'literary', 'Basic', 'vulgar', 'colloquial', 'slang']
    parsed = {'main': [], 'tagged': {}}
    
    for tag in tags:
        pattern = f'<a title="{tag}"><i>{tag[:3]}.</i></a>'
        if pattern in definition:
            parts = definition.split(pattern)
            parsed['main'].extend(parts[0].strip().split(', '))
            tagged_defs = parts[1].strip().split(', ')
            parsed['tagged'][tag] = tagged_defs
            definition = ', '.join(tagged_defs)
        
    if not parsed['tagged']:
        parsed['main'] = definition.split(', ')
    
    return parsed

def extract_verb_data(tr):
    tds = tr.find_all('td')
    if len(tds) != 5:
        return None

    verb = {
        "spokenEnglish": tds[0].text.strip(),
        "writtenEnglish": tds[1].text.strip(),
        "meaning": str(tds[2]),
        "writtenPersian": tds[3].text.strip(),
        "spokenPersian": tds[4].text.strip(),
        "isBasic": 'Basic' in str(tds[2])
    }
    return verb

# Read the HTML file
with open('basic_verbs.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

# Parse the HTML
soup = BeautifulSoup(html_content, 'html.parser')

# Find all table rows
rows = soup.find_all('tr')

# Extract verb data from each row
verbs = []
for row in rows:
    verb_data = extract_verb_data(row)
    if verb_data:
        verbs.append(verb_data)

# Write the data to a JSON file
with open('persian_verbs.json', 'w', encoding='utf-8') as json_file:
    json.dump(verbs, json_file, ensure_ascii=False, indent=2)

print("Conversion complete. Data saved to persian_verbs.json")