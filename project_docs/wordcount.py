import os
import re

docs_dir = r'c:\Users\Jeeva\Downloads\FYP\project_docs'
chapters = sorted([f for f in os.listdir(docs_dir) if f.startswith('Chapter_') and f.endswith('.md')])

unwanted_terms = ['skin', 'derm', 'lesion', 'melanoma', 'cancer']

for ch in chapters:
    filepath = os.path.join(docs_dir, ch)
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        
    words = re.findall(r'\b\w+\b', text.lower())
    word_count = len(words)
    
    found_unwanted = {term: text.lower().count(term) for term in unwanted_terms if term in text.lower()}
    
    repeated = len(re.findall(r'\b(\w+)\s+\1\b', text.lower()))
    
    print(f'FILE: {ch}')
    print(f'  Word Count: {word_count}')
    if found_unwanted:
        print(f'  Unwanted terms found: {found_unwanted}')
    if repeated > 10:
        print(f'  Excessively repeated adjacent words found: {repeated} instances')
    print('-' * 40)
