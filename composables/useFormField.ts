import { computed, useAttrs } from "vue";

type FormFieldProps = {
  id?: string;
  name?: string;
  disabled?: boolean;
};

/**
 * Small compatibility layer for the custom select controls. Nuxt UI no
 * longer exposes its internal useFormField path, so these controls keep the
 * needed field semantics without depending on a private package export.
 */
export function useAppFormField(props: FormFieldProps) {
  const attrs = useAttrs();
  const id = computed(() => props.id || (typeof attrs.id === "string" ? attrs.id : undefined));
  const name = computed(() => props.name || (typeof attrs.name === "string" ? attrs.name : undefined));
  const disabled = computed(() => Boolean(props.disabled || attrs.disabled === "" || attrs.disabled === true));
  const ariaAttrs = computed<Record<string, unknown>>(() => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(attrs)) {
      if (key.startsWith("aria-") || key === "role") result[key] = value;
    }
    return result;
  });
  const noop = () => undefined;

  return {
    id,
    name,
    disabled,
    ariaAttrs,
    emitFormChange: noop,
    emitFormInput: noop,
    emitFormBlur: noop,
    emitFormFocus: noop,
  };
}
