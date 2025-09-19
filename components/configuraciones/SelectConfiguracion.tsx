interface SelectConfiguracionProps {
  onChange: (value: string) => void;
  onClick: () => void;
  disabled?: boolean;
}

const SelectConfiguracion: React.FC<SelectConfiguracionProps> = ({
  onChange,
  onClick,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <select
        className="border rounded px-2 py-1 mr-2"
        defaultValue="1"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="1">Receta 1</option>
        <option value="2">Receta 2</option>
        <option value="3">Receta 3</option>
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        disabled={disabled}
        onClick={onClick}
      >
        Aplicar
      </button>
    </div>
  );
};

export default SelectConfiguracion;
