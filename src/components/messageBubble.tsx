import clsx from "clsx";

interface MessageProps {
  text: string;
  isSender: boolean; // true => current user (right side)
  timestamp?: string;
}

export function MessageBubble({ text, isSender, timestamp }: MessageProps) {
  return (
    <div
      className={clsx(
        "flex mb-2 w-full",
        isSender ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm",
          // ✅ Sender: colorful | Receiver: grey
          isSender
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        <p className="break-words">{text}</p>
        {timestamp && (
          <span
            className={clsx(
              "block text-[10px] mt-1 text-right",
              isSender ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
