"use client";

import { useActionState, useEffect } from "react";
import { createVendorAction, updateVendorAction } from "../actions";

export function useVendorForm(vendor?: any, onSuccess?: () => void) {
    const isEdit = !!vendor;

    const [state, formAction, pending] = useActionState(
        async (prevState: any, formData: FormData) => {
            try {
                if (isEdit) {
                    await updateVendorAction(vendor.id, formData);
                } else {
                    await createVendorAction(formData);
                }
                return { success: true };
            } catch (err: any) {
                return { error: err.message || "An error occurred" };
            }
        },
        null
    );

    useEffect(() => {
        if (state?.success && !pending) {
            onSuccess?.();
            const form = document.getElementById("vendor-form") as HTMLFormElement;
            form?.reset();
        }
    }, [state, pending, onSuccess]);

    return {
        formAction,
        pending,
        isEdit
    };
}
