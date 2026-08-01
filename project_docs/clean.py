import os
import re

docs_dir = r'c:\Users\Jeeva\Downloads\FYP\project_docs'
chapters = sorted([f for f in os.listdir(docs_dir) if f.startswith('Chapter_') and f.endswith('.md')])

def replace_terms(text):
    text = re.sub(r'\bdermatolog\w*', 'pharmacological', text, flags=re.IGNORECASE)
    text = re.sub(r'\bdermatic\b', 'pharmaceutical', text, flags=re.IGNORECASE)
    text = re.sub(r'\bdermoscop\w*', 'transactional', text, flags=re.IGNORECASE)
    text = re.sub(r'\bskin\b', 'drug', text, flags=re.IGNORECASE)
    text = re.sub(r'\blesions?\b', 'anomalies', text, flags=re.IGNORECASE)
    text = re.sub(r'\bmelanoma\b', 'shortages', text, flags=re.IGNORECASE)
    return text

def remove_repeats(text):
    return re.sub(r'\b(\w+)(?:\s+\1\b)+', r'\1', text, flags=re.IGNORECASE)

results = []

for ch in chapters:
    filepath = os.path.join(docs_dir, ch)
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    text = replace_terms(text)
    # run repeats twice to catch complex overlapping repeats just in case
    text = remove_repeats(text)
    text = remove_repeats(text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
        
    words = re.findall(r'\b\w+\b', text.lower())
    results.append(f'{ch}: {len(words)} words')

with open(os.path.join(docs_dir, 'cleaned_wordcount.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))
