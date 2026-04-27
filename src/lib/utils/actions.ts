import { toast } from "sonner";
import { useLoadingStore } from "../store/useLoadingStore";

interface ActionOptions<T> {
  scope?: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string | ((err: any) => string);
  onSuccess?: (data: T) => void;
  onError?: (err: any) => void;
}

/**
 * A senior-grade utility for executing async actions with automatic 
 * loading state tracking and toast feedback.
 */
export async function executeAction<T>(
  action: () => Promise<T>,
  options: ActionOptions<T> = {}
): Promise<T | null> {
  const { 
    scope, 
    loadingMessage = "Processing request...", 
    successMessage = "Action completed successfully",
    errorMessage = "An unexpected error occurred",
    onSuccess,
    onError
  } = options;

  const store = useLoadingStore.getState();
  
  if (scope) store.startLoading(scope);
  store.incrementRequests();

  const toastId = toast.loading(loadingMessage, {
    className: "font-display font-bold italic",
  });

  try {
    const result = await action();
    
    toast.success(successMessage, { 
        id: toastId,
        className: "font-display font-bold italic",
    });

    if (onSuccess) onSuccess(result);
    return result;
  } catch (err: any) {
    console.error("Action Error:", err);
    
    const finalErrorMsg = typeof errorMessage === 'function' 
        ? errorMessage(err) 
        : errorMessage;

    toast.error(finalErrorMsg, { 
        id: toastId,
        className: "font-display font-bold italic",
    });

    if (onError) onError(err);
    return null;
  } finally {
    if (scope) store.stopLoading(scope);
    store.decrementRequests();
  }
}

/**
 * Utility for handling file downloads with consistent feedback.
 */
export async function downloadAction(
  filename: string,
  downloadFn: () => Promise<void>,
  options: { loadingMessage?: string; successMessage?: string } = {}
) {
  const { 
    loadingMessage = `Preparing ${filename}...`, 
    successMessage = `${filename} downloaded successfully` 
  } = options;

  const toastId = toast.loading(loadingMessage, {
    className: "font-display font-bold italic",
  });

  try {
    await downloadFn();
    toast.success(successMessage, { 
      id: toastId,
      className: "font-display font-bold italic",
    });
  } catch (err) {
    toast.error(`Failed to download ${filename}`, { 
      id: toastId,
      className: "font-display font-bold italic",
    });
    throw err;
  }
}
