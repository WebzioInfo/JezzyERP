# Target invoice totals
# JE/B2B/01/26-27: 13,116.00 (Eranad, 01 Apr 2026) -> Solved: 57 KGS of SHRINK-ROLL at 195.00 = 11115 + 18% tax (2000.70) = 13115.70 -> Rounding 0.30 -> 13116.00
# JE/B2B/02/26-27: 2,20,005.00 (Eranad, 08 Apr 2026)
# JE/B2B/05/26-27: 46,256.00 (Eranad, 23 Apr 2026)
# JE/B2B/07/26-27: 3,63,440.00 (Eranad, 24 Apr 2026)
# JE/B2B/08/26-27: 33,040.00 (Gangothri, 27 Apr 2026)
# JE/B2B/09/26-27: 76,015.00 (Gangothri, 01 May 2026)
# JE/B2B/10/26-27: 13,717.00 (Spell Bound, 01 May 2026)

products = {
    "SHRINK-ROLL": {"rate": 195.00, "unit": "KGS"},
    "SHRINK-580": {"rate": 173.00, "unit": "KGS"},
    "SHRINK-500": {"rate": 173.00, "unit": "KGS"},
    "CAP-WHITE-27": {"rate": 0.35, "unit": "NOS"},
    "CAP-WHITE-26D": {"rate": 0.35, "unit": "NOS"},
    "CAP-BLUE-27": {"rate": 0.35, "unit": "NOS"},
    "CAP-WHITE-26F": {"rate": 0.35, "unit": "NOS"},
    "PET-13G": {"rate": 160.00, "unit": "KGS"},
    "PET-18.8G": {"rate": 160.00, "unit": "KGS"}
}

def check_single_item(target_total):
    print(f"\nChecking single item for target: {target_total}")
    for sku, p in products.items():
        rate = p["rate"]
        # Try to find a nice quantity
        # subtotal * 1.18 is approx target_total
        est_subtotal = target_total / 1.18
        # Let's check if qty is integer
        # We can also check if qty is float with 1 or 2 decimals
        for qty_multiplier in [1, 10, 100, 1000]:
            # we want qty to be nice. If unit is KGS, it can have decimals. If NOS, usually integer or multiples of 1000.
            # Let's search qty from 1 to 1000000
            pass
        
        # Simple search for qty:
        if p["unit"] == "NOS":
            # For NOS, qty is integer, usually multiples of 1000 or 5000 or 10000 (standard pack sizes)
            # Let's search in steps of 1000, 10000, etc.
            for qty in range(1000, 2000000, 1000):
                subtotal = qty * rate
                tax = round(subtotal * 0.18, 2)
                grand = subtotal + tax
                if round(grand) == target_total:
                    print(f"Match NOS: {qty} of {sku} @ {rate} -> Subtotal: {subtotal}, Tax: {tax}, Grand: {grand} (Rounded: {round(grand)})")
        else:
            # For KGS, qty can be float (e.g. 525.10)
            # Let's search for nice decimal quantities
            for qty_int in range(1, 10000):
                for dec in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]:
                    qty = qty_int + dec / 10.0
                    subtotal = qty * rate
                    tax = round(subtotal * 0.18, 2)
                    grand = subtotal + tax
                    if round(grand) == target_total:
                        print(f"Match KGS: {qty} of {sku} @ {rate} -> Subtotal: {subtotal}, Tax: {tax}, Grand: {grand} (Rounded: {round(grand)})")

targets = [220005, 46256, 363440, 33040, 76015, 13717]
for t in targets:
    check_single_item(t)
