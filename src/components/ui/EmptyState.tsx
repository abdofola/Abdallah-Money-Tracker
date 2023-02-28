import { Icon } from "@components/icons";
import React from "react";

export default function EmptyState({ className, icon, renderParagraph }) {
  return (
    <div className={className}>
      <span>
        <Icon href={icon} />
      </span>
      {renderParagraph()}
    </div>
  );
}
