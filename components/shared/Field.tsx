interface FieldProps {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

export default function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label className="block font-mono text-xs text-[#1d1b18]/65 uppercase tracking-wider mb-1.5">
        {label}
        {required && " *"}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          rows={3}
          placeholder={placeholder}
          className="w-full bg-[#f4f0e8] border border-[#1d1b18]/20 rounded px-3.5 py-2 text-sm text-[#1d1b18] placeholder:text-[#1d1b18]/30 focus:outline-none focus:border-[#bd4b2a] focus:ring-1 focus:ring-[#bd4b2a] font-sans resize-none transition-all"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          placeholder={placeholder}
          className="w-full bg-[#f4f0e8] border border-[#1d1b18]/20 rounded px-3.5 py-2 text-sm text-[#1d1b18] placeholder:text-[#1d1b18]/30 focus:outline-none focus:border-[#bd4b2a] focus:ring-1 focus:ring-[#bd4b2a] font-sans transition-all"
        />
      )}
    </div>
  );
}
