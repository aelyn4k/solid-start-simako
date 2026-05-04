import { Search } from "lucide-solid";

export default function SearchInput(props: {
  value: string;
  placeholder?: string;
  onInput: (value: string) => void;
}) {
  return (
    <div class="input-with-icon">
      <Search class="input-icon" size={17} />
      <input
        class="form-control form-control-icon"
        value={props.value}
        placeholder={props.placeholder ?? "Cari data"}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
    </div>
  );
}
