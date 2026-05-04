"use client";

import { useActionState, useEffect } from "react";
import { createVendorAction, updateVendorAction } from "../actions";

export function useVendorForm(vendor?: any, onSuccess?: (data?: any) => void) {
    const isEdit = !!(vendor && vendor.id);

    const [state, formAction, pending] = useActionState(
        async (prevState: any, formData: FormData) => {
            try {
                let result;
                if (isEdit) {
                    result = await updateVendorAction(vendor.id, formData);
                } else {
                    result = await createVendorAction(formData);
                }
                return { success: true, data: result };
            } catch (err: any) {
                return { error: err.message || "An error occurred" };
            }
        },
        null
    );

    useEffect(() => {
        if (state?.success && !pending) {
            onSuccess?.(state.data);
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
