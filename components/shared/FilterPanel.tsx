type SearchFilter = {
  type: "search";
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

type SelectFilter = {
  type: "select";
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
};

type FilterConfig = SearchFilter | SelectFilter;

interface FilterPanelProps {
  filters: FilterConfig[];
}

export function FilterPanel({ filters }: FilterPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filters.map((filter) => {
        if (filter.type === "search") {
          return (
            <label key={filter.label} className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">{filter.label}</span>
              <input
                type="search"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                placeholder={filter.placeholder}
                className="rounded border border-default bg-background px-3 py-2 text-sm"
              />
            </label>
          );
        }

        return (
          <label key={filter.label} className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">{filter.label}</span>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="rounded border border-default bg-background px-3 py-2 text-sm"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        );
      })}
    </div>
  );
}
