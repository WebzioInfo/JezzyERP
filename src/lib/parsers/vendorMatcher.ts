export function matchVendor(extractedGst: string, extractedName: string, vendors: any[]) {
    if (!vendors || vendors.length === 0) return null;

    // 1. Primary Match by GSTIN
    if (extractedGst && extractedGst.length > 5) {
        const exactGstMatch = vendors.find(v => v.gst === extractedGst);
        if (exactGstMatch) return exactGstMatch;
    }

    // 2. Secondary Fuzzy Match by Name
    if (extractedName && extractedName.length > 3) {
        const lowerExtracted = extractedName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Exact fuzzy
        let nameMatch = vendors.find(v => {
            const lowerV = v.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return lowerV === lowerExtracted || lowerV.includes(lowerExtracted) || lowerExtracted.includes(lowerV);
        });

        if (nameMatch) return nameMatch;
    }

    return null;
}
