import { useActionState } from "react";
import { createClientAction, updateClientAction } from "@/features/clients/actions/clientActions";
import { useToast } from "@/context/ToastContext";

export function useClientForm(client?: any, onSuccess?: () => void) {
    const { success, error } = useToast();
    const isEdit = !!client;

    const [state, formAction, pending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const res: any = isEdit
                ? await updateClientAction(client.id, formData)
                : await createClientAction(formData);

            if (res && 'error' in res) {
                error(res.error || `Failed to ${isEdit ? 'update' : 'add'} client.`);
                return { error: res.error };
            }
            if (res && 'success' in res) {
                success(isEdit ? "Client details updated successfully." : "New corporate client added to the directory.");
                if (onSuccess) onSuccess();
                const form = document.getElementById("client-form") as HTMLFormElement;
                form?.reset();
                return { success: true };
            }
            return prevState;
        },
        null
    );

    return { state, formAction, pending, isEdit };
}
