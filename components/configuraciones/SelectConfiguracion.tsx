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
    <div className="flex flex-row items-center justify-between">
      <select
        className="border bg-background2 rounded-sm px-2 py-1"
        defaultValue="1"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option
          className="text-texto bg-background4 hover:bg-background5"
          value="1"
        >
          Receta 1
        </option>
        <option
          className="text-texto bg-background4 hover:bg-background5"
          value="2"
        >
          Receta 2
        </option>
        <option
          className="text-texto bg-background4 hover:bg-background5"
          value="3"
        >
          Receta 3
        </option>
      </select>
      <button
        className="bg-blue px-5 py-1 rounded-sm disabled:opacity-50"
        disabled={disabled}
        onClick={onClick}
      >
        Aplicar
      </button>
    </div>
  );
};

export default SelectConfiguracion;
