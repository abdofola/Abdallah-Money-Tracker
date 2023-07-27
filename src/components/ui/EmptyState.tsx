import React from "react";
import { Icon } from "@components/icons";

type EmptyStateProps = {
  className?: string;
  icon?: string;
  renderParagraph: () => JSX.Element;
  iconJSX?: JSX.Element;
};

export default function EmptyState({
  className,
  icon,
  renderParagraph,
  iconJSX,
}: EmptyStateProps) {
  return (
    <div className={className}>
      <span>{icon ? <Icon href={icon} /> : iconJSX}</span>
      {renderParagraph()}
    </div>
  );
}
