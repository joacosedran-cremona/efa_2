import React, { useState, useEffect } from "react";

interface Torre {
  id: string;
}

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
  onTorresChange,
  selectedReceta,
  refreshTorres,
  refreshTorres2,
  selectedTorre,
  disabled = false,
}) => {
  const [torres, setTorres] = useState<Torre[]>([]);
  const [loading, setLoading] = useState(false);

  // useEffect para cargar torres cuando cambie la receta seleccionada
  useEffect(() => {
    const loadTorresAndSelectFirst = async () => {
      if (!selectedReceta) {
        setTorres([]);
        onTorresChange([]);
        onChange(""); // Limpiar selección si no hay receta

        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://192.168.20.42:8000/configuraciones/lista-torres?id_receta=${selectedReceta}`,
        );

        if (response.ok) {
          const data = await response.json();
          const torresData = data.ListadoTorres || [];

          setTorres(torresData);
          onTorresChange(torresData);

          // Preseleccionar automáticamente la primera torre disponible
          if (torresData.length > 0) {
            onChange(torresData[0].id);
          } else {
            onChange(""); // Si no hay torres, limpiar selección
          }
        } else {
          setTorres([]);
          onTorresChange([]);
          onChange("");
        }
      } catch {
        setTorres([]);
        onTorresChange([]);
        onChange("");
      } finally {
        setLoading(false);
      }
    };

    loadTorresAndSelectFirst();
  }, [selectedReceta]);

  // useEffect para manejar las funciones de refresh externas
  useEffect(() => {
    // Si existe refreshTorres, la llamamos directamente
    if (refreshTorres) {
      refreshTorres(selectedReceta);
    }
  }, [refreshTorres, refreshTorres2, selectedReceta]);

  return (
    <select
      className="border rounded px-2 py-1 w-full"
      disabled={disabled || loading}
      value={selectedTorre || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option
        className="text-texto bg-background4 hover:bg-background5"
        value=""
      >
        {loading ? "Cargando torres..." : "Seleccionar Torre"}
      </option>
      {torres.map((torre) => (
        <option
          key={torre.id}
          className="text-texto bg-background4 hover:bg-background5"
          value={torre.id}
        >
          {torre.id}
        </option>
      ))}
    </select>
  );
};

export default SelectTorre;
