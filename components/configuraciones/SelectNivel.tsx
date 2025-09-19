interface SelectNivelProps {
  onChange: (nivel: "HN" | "ChG" | "ChB" | "FA" | "uHN") => void;
  disabled?: boolean;
}

const SelectNivel: React.FC<SelectNivelProps> = ({
  onChange,
  disabled = false,
}) => {
  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue="HN"
      disabled={disabled}
      onChange={(e) =>
        onChange(e.target.value as "HN" | "ChG" | "ChB" | "FA" | "uHN")
      }
    >
      <option value="HN">Altura Nivel</option>
      <option value="ChG">Corr. Guardado</option>
      <option value="ChB">Corr. Búsqueda</option>
      <option value="FA">Fallas</option>
      <option value="uHN">Último Nivel</option>
    </select>
  );
};

export default SelectNivel;
