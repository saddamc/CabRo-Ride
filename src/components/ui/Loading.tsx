
import { cn } from "@/lib/utils";
import React from "react";
interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "bounce" | "ring" | "bars";
  text?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  color?: "primary" | "secondary" | "accent" | "muted";
}
const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "spinner",
  text,
  className,
  fullScreen = false,
  overlay = false,
  color = "primary",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { width: "w-4 h-4", text: "text-sm" },
    md: { width: "w-8 h-8", text: "text-base" },
    lg: { width: "w-12 h-12", text: "text-lg" },
    xl: { width: "w-16 h-16", text: "text-xl" },
  };
  // Color configurations
  const colorConfig = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
    muted: "border-muted-foreground",
  };
  // Spinner variant
  const Spinner = ({ className }: { className?: string }) => (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600",
        colorConfig[color],
        sizeConfig[size].width,
        className
      )}
    />
  );
  // Dots variant
  const Dots = ({ className }: { className?: string }) => (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-current animate-bounce",
            size === "sm" ? "w-1 h-1" :
            size === "md" ? "w-2 h-2" :
            size === "lg" ? "w-3 h-3" : "w-4 h-4",
            color
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
  // Pulse variant
  const Pulse = ({ className }: { className?: string }) => (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full animate-ping opacity-75",
          sizeConfig[size].width,
          `bg-${color}-500`
        )}
      />
      <div
        className={cn(
          "rounded-full absolute top-0 left-0",
          sizeConfig[size].width,
          `bg-${color}-600`
        )}
      />
    </div>
  );
  // Bounce variant
  const Bounce = ({ className }: { className?: string }) => (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-bounce bg-current rounded-full",
            size === "sm" ? "w-3 h-3" :
            size === "md" ? "w-4 h-4" :
            size === "lg" ? "w-5 h-5" : "w-6 h-6"
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
  // Ring variant
  const Ring = ({ className }: { className?: string }) => (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-gray-300 opacity-25",
          sizeConfig[size].width
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 animate-spin rounded-full border-4 border-transparent",
          sizeConfig[size].width
        )}
        style={{
          borderTopColor: "currentColor",
          animationDuration: "0.75s",
        }}
      />
    </div>
  );
  // Bars variant
  const Bars = ({ className }: { className?: string }) => (
    <div className={cn("flex items-end space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current animate-pulse",
            size === "sm" ? "w-1 h-2" :
            size === "md" ? "w-1.5 h-3" :
            size === "lg" ? "w-2 h-4" : "w-2.5 h-6"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
  // Render different variants
  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <Spinner />;
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      case "bounce":
        return <Bounce />;
      case "ring":
        return <Ring />;
      case "bars":
        return <Bars />;
      default:
        return <Spinner />;
    }
  };
  // Container classes
  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-3",
    fullScreen && "min-h-screen",
    overlay && "absolute inset-0 bg-background/50 backdrop-blur-sm",
    className
  );
  return (
    <div className={containerClasses}>
      <div className={cn("text-current", color)}>
        {renderLoader()}
      </div>
      {text && (
        <div className={cn(
          "text-muted-foreground font-medium animate-pulse",
          sizeConfig[size].text
        )}>
          {text}
        </div>
      )}
    </div>
  );
};
// Predefined variants for common use cases
export const FullScreenLoading = (props: Omit<LoadingProps, 'fullScreen'>) => (
  <Loading {...props} fullScreen />
);
export const InlineLoading = (props: LoadingProps) => (
  <Loading {...props} size="sm" />
);
export const CardLoading = () => (
  <div className="flex items-center justify-center h-32">
    <Loading size="md" text="Loading content..." />
  </div>
);
export const ButtonLoading = () => (
  <div className="flex items-center gap-2">
    <Loading size="sm" variant="spinner" />
    <span>Loading...</span>
  </div>
);
export default Loading;