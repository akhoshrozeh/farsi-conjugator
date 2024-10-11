from bs4 import BeautifulSoup
import re

def extract_verb_info(html_file):
    with open(html_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
    
    # Extract verb name and Persian script
    h1 = soup.find('h1')
    verb_name = h1.contents[0].strip()
    persian_script = h1.find('a').text if h1.find('a') else None

    # Extract stems
    stems = {}
    stem_table = soup.find('table', class_='conj')
    if stem_table:
        stems['past'] = stem_table.find('td', class_='past').text.strip()
        stems['present'] = stem_table.find('td', class_='present').text.strip()

    # Extract meanings
    meanings = []
    ol = soup.find('ol', class_='mean_several')
    if ol:
        for li in ol.find_all('li', recursive=False):
            meanings.append(li.contents[0].strip())

    # Extract conjugation tables
    conjugations = {}
    for table in soup.find_all('table', class_='conj paradigm'):
        tense = table.find('th').text.strip()
        conjugations[tense] = {}
        for row in table.find_all('tr')[1:]:  # Skip header row
            pronoun = row.find('th').text.strip()
            conjugations[tense][pronoun] = [td.text.strip() for td in row.find_all('td')]

    return {
        'verb_name': verb_name,
        'persian_script': persian_script,
        'stems': stems,
        'meanings': meanings,
        'conjugations': conjugations
    }

# Usage
result = extract_verb_info('output.html')
print(result)
