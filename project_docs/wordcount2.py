import os
import re

docs_dir = r'c:\Users\Jeeva\Downloads\FYP\project_docs'
chapters = sorted([f for f in os.listdir(docs_dir) if f.startswith('Chapter_') and f.endswith('.md')])

unwanted_terms = ['skin', 'derm', 'lesion', 'melanoma', 'cancer']
results = []

for ch in chapters:
    filepath = os.path.join(docs_dir, ch)
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        
    words = re.findall(r'\b\w+\b', text.lower())
    word_count = len(words)
    
    found_unwanted = {term: text.lower().count(term) for term in unwanted_terms if term in text.lower()}
    repeated = len(re.findall(r'\b(\w+)\s+\1\b', text.lower()))
    
    results.append(f'FILE: {ch}')
    results.append(f'  Word Count: {word_count}')
    if found_unwanted:
        results.append(f'  Unwanted terms found: {found_unwanted}')
    if repeated > 0:
        results.append(f'  Excessively repeated adjacent words found: {repeated} instances')
    results.append('-' * 40)

with open(r'c:\Users\Jeeva\Downloads\FYP\project_docs\wordcount_results.txt', 'w') as f:
    f.write('\n'.join(results))
