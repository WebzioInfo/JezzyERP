import os
import re

brain_dir = r"C:\Users\sanoo\.gemini\antigravity\brain"
output_file = r"d:\Webzio\Billing ERPs\jezzy-erp\scratch\clean_invoices.txt"

# Matches patterns like JE/B2B/01/26-27 or JE/B2B/13 or any similar invoice pattern
pattern = re.compile(r"JE/B2B/\d{2}")

matches = []

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file == 'overview.txt':
            full_path = os.path.join(root, file)
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Let's find all occurrences of any text block that contains JE/B2B/
                # We split the file content into lines or search for sections
                for line in content.split('\n'):
                    if 'JE/B2B/' in line:
                        matches.append(line.strip())
            except Exception as e:
                pass

# De-duplicate matches
unique_matches = sorted(list(set(matches)))

with open(output_file, 'w', encoding='utf-8') as out:
    for m in unique_matches:
        out.write(m + "\n")

print(f"Extracted {len(unique_matches)} unique lines containing JE/B2B/. saved to scratch/clean_invoices.txt")
