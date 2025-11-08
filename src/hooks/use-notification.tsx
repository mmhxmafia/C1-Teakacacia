import { useToast } from "@/hooks/use-toast";
import { notificationStyles, notificationMessages, NotificationOptions } from "@/lib/notifications";

export const useNotification = () => {
  const { toast } = useToast();

  const showNotification = (
    type: keyof typeof notificationStyles,
    options: NotificationOptions | string
  ) => {
    const style = notificationStyles[type];
    const Icon = style.icon;
    
    // Handle string shorthand
    const notificationOptions = typeof options === 'string' 
      ? { title: options } 
      : options;

    toast({
      variant: style.variant,
      title: notificationOptions.title,
      description: notificationOptions.description
        ? (
            <div className="flex items-start gap-2">
              <Icon className={`h-4 w-4 mt-0.5 ${style.iconColor} flex-shrink-0`} />
              <span>{notificationOptions.description}</span>
            </div>
          )
        : undefined,
      duration: notificationOptions.duration,
    } as any);
  };

  return {
    // Convenient methods
    success: (options: NotificationOptions | string) => showNotification("success", options),
    error: (options: NotificationOptions | string) => showNotification("error", options),
    warning: (options: NotificationOptions | string) => showNotification("warning", options),
    info: (options: NotificationOptions | string) => showNotification("info", options),
    default: (options: NotificationOptions | string) => showNotification("default", options),
    
    // Pre-defined messages
    messages: notificationMessages,
    
    // Raw toast for custom use
    toast,
  };
};
