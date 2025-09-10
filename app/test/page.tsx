"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function MachineMonitor() {
  // Get WebSocket data from Auth context
  const { websocketData } = useAuth();
  const { data, isConnected, error, reconnect } = websocketData;
  const [showRawData, setShowRawData] = useState(true);

  // If there's an error, show it and provide a reconnect button
  if (error) {
    return (
      <div>
        Error: {error.message} <button onClick={reconnect}>Reconectar</button>
      </div>
    );
  }

  return (
    <div className="machine-monitor">
      <p>Estado de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>

      {/* Toggle button for raw data display */}
      <button
        onClick={() => setShowRawData(!showRawData)}
        style={{ marginBottom: "1rem" }}
      >
        {showRawData ? "Ocultar datos crudos" : "Mostrar datos crudos"}
      </button>

      {/* Raw JSON data display */}
      {data && showRawData && (
        <div className="raw-data" style={{ marginBottom: "2rem" }}>
          <h2>Datos JSON Completos</h2>
          <div className="bg-background2"
            style={{
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "500px",
            }}
          >
            <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Formatted data display */}
      {data && (
        <>
          <div className="machine-status">
            <h2>Estado de la máquina</h2>
            <p>Producto: {data.machineStatus.CodigoProducto}</p>
            <p>Estado: {data.machineStatus.estadoMaquina}</p>
            <p>Tiempo: {data.machineStatus.TiempoTranscurrido}</p>
            <p>
              Nivel actual: {data.machineStatus.sdda_nivel_actual} /{" "}
              {data.machineStatus.TotalNiveles}
            </p>
          </div>

          <div className="technical-data">
            <h2>Datos técnicos</h2>
            <p>
              Posición robot: X:{data.technicalData.datosRobot.posicionX}, Y:
              {data.technicalData.datosRobot.posicionY}, Z:
              {data.technicalData.datosRobot.posicionZ}
            </p>
            <p>Torre actual: {data.technicalData.datosTorre.N_torre_actual}</p>
            <p>Gripper: {data.technicalData.datosGripper.NGripperActual}</p>
          </div>

          <div className="alarms">
            <h2>Alarmas activas</h2>
            {data.alarms.filter((alarm) => alarm.estadoAlarma).length > 0 ? (
              <ul>
                {data.alarms
                  .filter((alarm) => alarm.estadoAlarma)
                  .map((alarm) => (
                    <li key={alarm.id_alarma}>
                      <strong>{alarm.tipoAlarma}</strong>: {alarm.descripcion}
                      <span className="timestamp">{alarm.fechaRegistro}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No hay alarmas activas</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
