interface FilterOption<T extends string> {
  label: string;
  value: T;
}

export default function FilterSelect<T extends string>(props: {
  value: T;
  options: FilterOption<T>[];
  ariaLabel?: string;
  onChange: (value: T) => void;
}) {
  return (
    <select
      class="form-control"
      aria-label={props.ariaLabel ?? "Filter data"}
      value={props.value}
      onInput={(event) => props.onChange(event.currentTarget.value as T)}
    >
      {props.options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
