import React from "react";

type CommonProps = {
  label?: string;
  hint?: string;
  invalid?: boolean;
  className?: string;
};

type InputOnly = CommonProps & React.InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaOnly = CommonProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export function Input(props: InputOnly | TextareaOnly) {
  const { label, hint, invalid = false, multiline = false, className = "", id, ...rest } = props as CommonProps & {
    multiline?: boolean;
    id?: string;
  } & Record<string, unknown>;
  const autoId = React.useId();
  const fieldId = id || autoId;
  const inputCls = ["av-input", invalid ? "av-input--invalid" : "", className].filter(Boolean).join(" ");
  const control = multiline ? (
    <textarea id={fieldId} className={inputCls} aria-invalid={invalid} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
  ) : (
    <input id={fieldId} className={inputCls} aria-invalid={invalid} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
  );
  if (!label && !hint) return control;
  return (
    <div className="av-field">
      {label && (
        <label className="av-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      {control}
      {hint && <span className="av-field__hint">{hint}</span>}
    </div>
  );
}
