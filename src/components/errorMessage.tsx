import { TriangleAlert } from "lucide-react";
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="text-destructive flex gap-2">
       
            <TriangleAlert/>
       
      <p className="text-destructive text-sm mt-1 font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;
