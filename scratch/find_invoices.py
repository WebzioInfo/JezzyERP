import os

brain_dir = r"C:\Users\sanoo\.gemini\antigravity\brain"
output_file = r"d:\Webzio\Billing ERPs\jezzy-erp\scratch\matched_invoices.txt"

with open(output_file, 'w', encoding='utf-8') as out:
    for root, dirs, files in os.walk(brain_dir):
        for file in files:
            if file == 'overview.txt':
                full_path = os.path.join(root, file)
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    
                    for idx, line in enumerate(lines):
                        if 'JE/B2B/' in line:
                            out.write(f"\n=========================================\n")
                            out.write(f"FILE: {full_path} | LINE {idx + 1}\n")
                            out.write(f"=========================================\n")
                            
                            start = max(0, idx - 10)
                            end = min(len(lines), idx + 80)
                            
                            for c_idx in range(start, end):
                                marker = ">>> " if c_idx == idx else "    "
                                out.write(f"{marker}{c_idx + 1}: {lines[c_idx]}")
                except Exception as e:
                    out.write(f"Error reading {full_path}: {str(e)}\n")

print("Done searching.")
