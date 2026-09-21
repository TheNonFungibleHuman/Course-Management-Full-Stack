// A form field with its label, control and validation message.
//
// `as` chooses the control so the same component covers text inputs, textareas
// and selects; `children` supplies the options for a select. The error message is
// rendered below the control and the whole field is marked so the border can be
// highlighted.
export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  as = "input",
  placeholder,
  required = false,
  rows,
  children,
  min,
  step,
  maxLength,
}) {
  const id = `field-${name}`;
  const common = {
    id,
    name,
    value: value ?? "",
    placeholder,
    onChange: (event) => onChange(name, event.target.value),
  };

  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {as === "textarea" ? (
        <textarea {...common} rows={rows || 3} maxLength={maxLength} />
      ) : as === "select" ? (
        <select {...common}>{children}</select>
      ) : (
        <input {...common} type={type} min={min} step={step} maxLength={maxLength} />
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
