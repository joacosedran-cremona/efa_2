interface SelectTorreProps {
  onChange: (torre: string) => void;
  onTorresChange: (torres: any[]) => void;
  selectedReceta: string;
  refreshTorres: (tag?: string) => void;
  refreshTorres2: () => void;
  selectedTorre: string | null;
  disabled?: boolean;
}

const SelectTorre: React.FC<SelectTorreProps> = ({
  onChange,
  selectedTorre,
  disabled = false,
}) => {
  return (
    <select
      className="border rounded px-2 py-1"
      disabled={disabled}
      value={selectedTorre || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value=""
      >
        Seleccionar Torre
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="T1"
      >
        Torre 1
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="T2"
      >
        Torre 2
      </option>
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value="T3"
      >
        Torre 3
      </option>
    </select>
  );
};

export default SelectTorre;
