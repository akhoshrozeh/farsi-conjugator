import json

with open('/Users/akhoshrozeh/Projects/farsi-conjugation/scrapers/all_verbs_parsed.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    verb_count = len(data)
    print(f"Total number of verbs in the file: {verb_count}")