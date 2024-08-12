import { toast } from "@/components/ui/use-toast";

const toastConfig = {
  duration: 5000,
  className: "bg-primary text-white font-bold",
  variant: "outline",
  style: {
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

export const showToast = (
  title: string,
  description?: string,
  isError = false,
) => {
  toast({
    ...toastConfig,
    title,
    description,
    variant: isError ? "destructive" : "default",
  });
};
