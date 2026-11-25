import React from 'react';
import type { ActionNeededTone } from '@/components/Cart/actionNeeded';

interface ActionNeededMessageProps {
  type: ActionNeededTone;
  message: string;
}

const TONE_CLASS: Record<ActionNeededTone, string> = {
  success: 'border-[#2A5E45] bg-[#F4F8F6] text-[#2A5E45]',
  warning: 'border-[#C4A35A] bg-[#FBF7EE] text-[#8A6424]',
  error: 'border-[#A83232] bg-[#FBF4F4] text-[#A83232]',
};

const MessageIcon: React.FC<{ type: ActionNeededTone }> = ({ type }) => {
  if (type === 'success') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.25 8.15 7.05 9.9 10.75 6.15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.75v4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.15" r="0.75" fill="currentColor" />
    </svg>
  );
};

const ActionNeededMessage: React.FC<ActionNeededMessageProps> = ({
  type,
  message,
}) => {
  if (!message) return null;

  return (
    <div
      role="status"
      className={`my-6 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm leading-snug ${TONE_CLASS[type]}`}
    >
      <MessageIcon type={type} />
      <span>{message}</span>
    </div>
  );
};

export default ActionNeededMessage;
