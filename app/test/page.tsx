"use client";
import type { Alarm } from "@/interfaces/websocket";

import { useState } from "react";

import { useApp } from "@/context/AppContext";

export default function MachineMonitor() {
  const { websocketData } = useApp();
  const { data, isConnected, error, reconnect } = websocketData;
  const [showRawData, setShowRawData] = useState(true);

  if (error) {
    return (
      <div>
        Error: {error.message} <button onClick={reconnect}>Reconectar</button>
      </div>
    );
  }

  return (
    <div className="machine-monitor p-5">
      <p>Estado de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>

      <button
        style={{ marginBottom: "1rem" }}
        onClick={() => setShowRawData(!showRawData)}
      >
        {showRawData ? "Ocultar datos crudos" : "Mostrar datos crudos"}
      </button>

      {data && showRawData && (
        <div className="raw-data" style={{ marginBottom: "2rem" }}>
          <p>Datos JSON Completos</p>
          <div
            className="bg-background2"
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

      {data && (
        <>
          <div className="machine-status">
            <p>Estado de la máquina</p>
            <p>Producto: {data.machineStatus.CodigoProducto}</p>
            <p>Estado: {data.machineStatus.estadoMaquina}</p>
            <p>Tiempo: {data.machineStatus.TiempoTranscurrido}</p>
            <p>
              Nivel actual: {data.machineStatus.sdda_nivel_actual} /{" "}
              {data.machineStatus.TotalNiveles}
            </p>
          </div>

          <div className="technical-data">
            <p>Datos técnicos</p>
            <p>
              Posición robot: X:{data.technicalData.datosRobot.posicionX}, Y:
              {data.technicalData.datosRobot.posicionY}, Z:
              {data.technicalData.datosRobot.posicionZ}
            </p>
            <p>Torre actual: {data.technicalData.datosTorre.N_torre_actual}</p>
            <p>Gripper: {data.technicalData.datosGripper.NGripperActual}</p>
          </div>

          <div className="alarms">
            <p>Alarmas activas</p>
            {data.alarms.filter((alarm: Alarm) => alarm.estadoAlarma).length >
            0 ? (
              <ul>
                {data.alarms
                  .filter((alarm: Alarm) => alarm.estadoAlarma)
                  .map((alarm: Alarm) => (
                    <li key={alarm.id_alarma}>
                      <strong>{alarm.tipoAlarma}</strong>: {alarm.descripcion}
                      <p className="timestamp">{alarm.fechaRegistro}</p>
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
