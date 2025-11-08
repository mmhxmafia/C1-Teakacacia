import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      style={{ zIndex: 9999 }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg pointer-events-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground pointer-events-auto",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground pointer-events-auto",
          closeButton: "pointer-events-auto hover:bg-background/80 transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
