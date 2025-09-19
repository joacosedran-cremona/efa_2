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
      <option value="">Seleccionar Torre</option>
      <option value="T1">Torre 1</option>
      <option value="T2">Torre 2</option>
      <option value="T3">Torre 3</option>
    </select>
  );
};

export default SelectTorre;
