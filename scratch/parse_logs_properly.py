import os
import json
import re

brain_dir = r"C:\Users\sanoo\.gemini\antigravity\brain"
output_file = r"d:\Webzio\Billing ERPs\jezzy-erp\scratch\raw_invoices_context.txt"

all_contexts = []

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file == 'overview.txt':
            full_path = os.path.join(root, file)
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    for line_num, line in enumerate(f, 1):
                        try:
                            data = json.loads(line)
                            content = data.get('content', '')
                        except json.JSONDecodeError:
                            content = line
                        
                        content_lines = content.split('\n')
                        for idx, cl in enumerate(content_lines):
                            if 'JE/B2B/' in cl:
                                start = max(0, idx - 5)
                                end = min(len(content_lines), idx + 20)
                                context = content_lines[start:end]
                                all_contexts.append({
                                    'path': full_path,
                                    'line_num': line_num,
                                    'match_idx': idx,
                                    'context': '\n'.join(context)
                                })
            except Exception as e:
                print(f"Error reading {full_path}: {e}")

# Save contexts
with open(output_file, 'w', encoding='utf-8') as out:
    for idx, item in enumerate(all_contexts):
        out.write(f"=== MATCH {idx+1} ===\n")
        out.write(f"File: {item['path']} (Line: {item['line_num']}, Content Line: {item['match_idx']})\n")
        out.write("-" * 40 + "\n")
        out.write(item['context'] + "\n")
        out.write("=" * 60 + "\n\n")

print(f"Extracted {len(all_contexts)} matched contexts to {output_file}")
