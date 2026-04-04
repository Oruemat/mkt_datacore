"use client";

interface Email {
  day: number;
  subject: string;
  body: string;
  objective: string;
}

interface EmailPreviewProps {
  emails: Email[];
}

export function EmailPreview({ emails }: EmailPreviewProps) {
  return (
    <div className="space-y-3">
      {emails.map((email, i) => (
        <div key={i} className="bg-white border border-dc-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-dc-blue-50 text-dc-blue-600 rounded-full">
              Dia {email.day}
            </span>
            <span className="text-[10px] text-dc-gray-400 uppercase tracking-wider">{email.objective}</span>
          </div>
          <h4 className="text-sm font-semibold text-dc-gray-900 mb-1">{email.subject}</h4>
          <p className="text-xs text-dc-gray-600 leading-relaxed whitespace-pre-wrap">{email.body}</p>
        </div>
      ))}
    </div>
  );
}
