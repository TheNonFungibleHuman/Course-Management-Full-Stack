import { useCallback, useState } from "react";

// Form state, validation and submission in one place, so every page follows the
// same pattern: validate locally, submit, then either reset and report success or
// surface the message from the API.
//
// validate receives the current values and returns { field: "message" }.
// onSubmit receives the values and may throw; anything it throws is reported
// through onError.
export default function useForm({ initialValues, validate, onSubmit, onSuccess, onError }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clears the message for a field as soon as the user edits it, so the error
    // does not linger while they are fixing it.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const reset = useCallback(
    (next = initialValues) => {
      setValues(next);
      setErrors({});
    },
    [initialValues]
  );

  const handleSubmit = useCallback(
    async (event) => {
      if (event && event.preventDefault) event.preventDefault();

      const validationErrors = validate ? validate(values) : {};
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setSubmitting(true);
      try {
        await onSubmit(values);
        setValues(initialValues);
        setErrors({});
        if (onSuccess) onSuccess();
        return true;
      } catch (error) {
        // A rejected submission may carry per-field messages from the API, so
        // those mark the individual inputs while the sentence goes to the toast.
        if (error && error.errors) setErrors(error.errors);
        if (onError) onError(error);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [values, validate, onSubmit, onSuccess, onError, initialValues]
  );

  return { values, errors, submitting, setField, setValues, reset, handleSubmit };
}
