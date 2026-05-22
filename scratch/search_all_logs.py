import os
import json

brain_dir = r"C:\Users\sanoo\.gemini\antigravity\brain"
output_file = r"d:\Webzio\Billing ERPs\jezzy-erp\scratch\company_logs_matches.txt"

keywords = ["eranad", "gangothri", "spell bound", "spellbound", "diamond", "faiha", "bridge drops", "essar enterprises"]

matches = []

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
                            cl_lower = cl.lower()
                            if any(k in cl_lower for k in keywords):
                                # Grab context
                                start = max(0, idx - 4)
                                end = min(len(content_lines), idx + 10)
                                context = content_lines[start:end]
                                matches.append({
                                    'path': full_path,
                                    'line_num': line_num,
                                    'content_line': idx,
                                    'context': '\n'.join(context)
                                })
            except Exception as e:
                print(f"Error reading {full_path}: {e}")

with open(output_file, 'w', encoding='utf-8') as out:
    for idx, m in enumerate(matches):
        out.write(f"=== MATCH {idx+1} ===\n")
        out.write(f"File: {m['path']} (Line: {m['line_num']}, Content Line: {m['content_line']})\n")
        out.write("-" * 40 + "\n")
        out.write(m['context'] + "\n")
        out.write("=" * 60 + "\n\n")

print(f"Saved {len(matches)} matches to {output_file}")
