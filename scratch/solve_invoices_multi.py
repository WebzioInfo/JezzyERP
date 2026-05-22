# Multi-item solver
import itertools

products = [
    {"sku": "SHRINK-ROLL", "rate": 195.00, "unit": "KGS"},
    {"sku": "SHRINK-580", "rate": 173.00, "unit": "KGS"},
    {"sku": "SHRINK-500", "rate": 173.00, "unit": "KGS"},
    {"sku": "CAP-WHITE-27", "rate": 0.35, "unit": "NOS"},
    {"sku": "CAP-WHITE-26D", "rate": 0.35, "unit": "NOS"},
    {"sku": "CAP-BLUE-27", "rate": 0.35, "unit": "NOS"},
    {"sku": "CAP-WHITE-26F", "rate": 0.35, "unit": "NOS"},
    {"sku": "PET-13G", "rate": 160.00, "unit": "KGS"},
    {"sku": "PET-18.8G", "rate": 160.00, "unit": "KGS"}
]

# Target grand totals
targets = {
    220005: "JE/B2B/02/26-27 (Eranad)",
    76015: "JE/B2B/09/26-27 (Gangothri)",
    13717: "JE/B2B/10/26-27 (Spell Bound)"
}

def solve():
    for target, label in targets.items():
        print(f"\n--- Solving for {label} (Target: {target}) ---")
        # Try 2 products:
        found = False
        for p1, p2 in itertools.combinations(products, 2):
            rate1 = p1["rate"]
            rate2 = p2["rate"]
            
            # We want nice quantities
            # Qty for NOS is usually multiple of 10,000 or 1,000 (e.g. 50,000, 120,000)
            # Qty for KGS is usually float with 0 or 1 decimal place, e.g. 100, 150.5, 300
            
            # Let's search range of quantities
            q1_vals = []
            if p1["unit"] == "NOS":
                q1_vals = [x * 1000 for x in range(1, 1000)] # up to 1 million in steps of 1000
            else:
                q1_vals = [x * 10 for x in range(1, 200)] + [x + 0.5 for x in range(1, 500)]
                
            q2_vals = []
            if p2["unit"] == "NOS":
                q2_vals = [x * 1000 for x in range(1, 1000)]
            else:
                q2_vals = [x * 10 for x in range(1, 200)] + [x + 0.5 for x in range(1, 500)]

            for q1 in q1_vals:
                for q2 in q2_vals:
                    subtotal = q1 * rate1 + q2 * rate2
                    tax = round(subtotal * 0.18, 2)
                    grand = subtotal + tax
                    if round(grand) == target:
                        print(f"Match: {q1} of {p1['sku']} + {q2} of {p2['sku']} -> Grand: {grand}")
                        found = True
                        break
                if found:
                    break

solve()
