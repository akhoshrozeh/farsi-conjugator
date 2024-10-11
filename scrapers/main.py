# 1. Parse the basic verbs
# 2. read in the table rows, row by row
# there are 5 columns per row: written/spoken english, meanings, written/spoken persian
#     - the spoken are not always present
# - the ones that are present have <a> tags with an href that goes to that version of the verb's conjugations
# - download that link
# - parse the cojugations and return a conjugations object
# - that object gets added to the json object

# schema:
# interface Verb {
  
#   spokenEnglish?: string
#   writtenEnglish: string;
#   meaning: string;
#   writtenPersian: string;
#   spokenEnglish?: string;
#   conjugations: {
#     {
#         positive: [tense1]: {6 strings} // some could be empty, like for imperative tense,
#         negative: [tense1]: {6 strings} // some could be empty, like for imperative tense,
#     }
#   }


# }
import time
import json
from bs4 import BeautifulSoup
import re
import requests
from pprint import pprint
import unicodedata


def normalize_arabic_text(text):
    # Normalize the text to NFC form without removing ZWNJ
    normalized_text = unicodedata.normalize('NFC', text)
    return normalized_text

def get_conjugations(url):
    pronouns = ["man", "to", ]
    response = requests.get(url)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all <p> tags
    paragraphs = soup.find_all('p')
    conjugations = {}

    for paragraph in paragraphs:
        # Check if the paragraph contains "positive form" or "negative form"
        form_type = None
        if "positive form" in paragraph.text.lower():
            form_type = "positive"
        elif "negative form" in paragraph.text.lower():
            form_type = "negative"

        # If form_type is determined, find all subsequent tables
        if form_type:
            next_sibling = paragraph.find_next_sibling()
            while next_sibling and next_sibling.name == 'table':
                if 'conj' in next_sibling.get('class', []) or 'conjr' in next_sibling.get('class', []):
                    # Process the table
                    rows = next_sibling.find_all('tr')
                    columns = list(zip(*[row.find_all(['th', 'td']) for row in rows]))

                    for column in columns:
                        headers = column[0].text.strip() if column[0].name == 'th' else None
                        data = [normalize_arabic_text(cell.text.strip()) for cell in column[1:]]

                        # Store the data in the conjugations dictionary
                        if headers:
                            if headers not in conjugations:
                                conjugations[headers] = {}
                            if form_type not in conjugations[headers]:
                                conjugations[headers][form_type] = []
                            conjugations[headers][form_type].extend(data)

                # Move to the next sibling
                next_sibling = next_sibling.find_next_sibling()

    pprint(conjugations)
    return conjugations

def extract_verb_data(tr):
    base_url = "http://artyom.ice-lc.com/pvc/"
    tds = tr.find_all('td')
    if len(tds) != 5:
        return None

    verb = {
        "spokenEnglish": tds[0].text.strip(),
        "writtenEnglish": tds[1].text.strip(),
        "meaning": str(tds[2]),
        "writtenPersian": tds[3].text.strip(),
        "spokenPersian": tds[4].text.strip(),
        "isBasic": 'Basic' in str(tds[2]),
        "conjugations": {}
    }

    if verb['spokenEnglish'] != '':
        full_url = base_url + tds[0].find('a')['href']
        verb['conjugations']['spokenEnglish'] = get_conjugations(full_url)
         
    full_url = base_url + tds[1].find('a')['href']
    verb['conjugations']['writtenEnglish'] = get_conjugations(full_url)

    full_url = base_url + tds[3].find('a')['href']
    verb['conjugations']['writtenPersian'] = get_conjugations(full_url)

    if verb['spokenPersian'] != '':
        full_url = base_url + tds[4].find('a')['href']
        verb['conjugations']['spokenPersian'] = get_conjugations(full_url)

    return verb

def main():
    # Read the HTML file
    with open('basic_verbs.html', 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all table rows
    rows = soup.find_all('tr')

    # Extract verb data from each row
    verbs = []
    i = 0
    for row in rows:
        time.sleep(2)
        i += 1
        verb_data = extract_verb_data(row)
        if verb_data:
            verbs.append(verb_data)

        if i == 25:
            break
        

    # Write the data to a JSON file
    with open('basic_verbs_parsed.json', 'w', encoding='utf-8') as json_file:
        json.dump(verbs, json_file, ensure_ascii=False, indent=2)

    print("Conversion complete. Data saved to persian_verbs.json")

main()