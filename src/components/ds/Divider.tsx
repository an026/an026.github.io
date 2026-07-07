import React from "react";

export function Divider({
  orientation = "horizontal",
  strong = false,
  label,
  className = "",
  ...rest
}: {
  orientation?: "horizontal" | "vertical";
  strong?: boolean;
  label?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  if (label) {
    return (
      <div className={["av-divider--labeled", className].filter(Boolean).join(" ")} {...rest}>
        {label}
      </div>
    );
  }
  const cls = ["av-divider", orientation === "vertical" ? "av-divider--v" : "av-divider--h", strong ? "av-divider--strong" : "", className]
    .filter(Boolean)
    .join(" ");
  return <hr className={cls} {...rest} />;
}
