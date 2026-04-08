"use client";

import { useActionState, useEffect } from "react";
import { createVendorAction, updateVendorAction } from "../actions";

export function useVendorForm(vendor?: any, onSuccess?: () => void) {
    const isEdit = !!vendor;

    const action = isEdit 
        ? updateVendorAction.bind(null, vendor.id) 
        : createVendorAction;

    const [state, formAction, pending] = useActionState(action as any, null);

    useEffect(() => {
        if (state === undefined && !pending) {
            onSuccess?.();
        }
    }, [state, pending, onSuccess]);

    return {
        formAction,
        pending,
        isEdit
    };
}
