type FeedbackKind = "success" | "error" | "info";

export function useFeedback() {
  const toast = useToast();

  const notify = (kind: FeedbackKind, title: string, description?: string) => {
    toast.add({ title, description, color: kind === "error" ? "error" : kind });
  };

  return {
    success: (title: string, description?: string) => notify("success", title, description),
    error: (title: string, description?: string) => notify("error", title, description),
    info: (title: string, description?: string) => notify("info", title, description),
  };
}
