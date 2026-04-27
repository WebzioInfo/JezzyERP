import { useActionState } from "react";
import { createClientAction, updateClientAction } from "@/features/clients/actions/clientActions";
import { executeAction } from "@/lib/utils/actions";

export function useClientForm(client?: any, onSuccess?: () => void) {
    const isEdit = !!client;

    const [state, formAction, pending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const res = await executeAction(
                async () => isEdit 
                    ? updateClientAction(client.id, formData) 
                    : createClientAction(formData),
                {
                    scope: 'client-form',
                    loadingMessage: isEdit ? 'Syncing updates...' : 'Initializing profile...',
                    successMessage: isEdit ? 'Client profile updated.' : 'Client successfully onboarded.',
                }
            );

            if (res && 'success' in (res as any)) {
                if (onSuccess) onSuccess();
                const form = document.getElementById("client-form") as HTMLFormElement;
                form?.reset();
                return { success: true };
            }
            
            return res as any || prevState;
        },
        null
    );

    return { state, formAction, pending, isEdit };
}
