export interface MachineStatus {
  idRecetaActual: number;
  idRecetaProxima: string;
  CodigoProducto: string;
  TotalNiveles: number;
  TipoMolde: string;
  desmoldeoBanda: string;
  PesoProducto: number;
  sdda_nivel_actual: number;
  NGripperActual: number;
  PesoActualDesmoldado: number;
  TorreActual: number;
  estadoMaquina: string;
  TiempoTranscurrido: string;
}

export interface DesmoldeoData {
  "Nombre actual": string;
  PesoProducto: number;
  TotalNiveles: number;
  sdda_nivel_actual: number;
  estadoMaquina: string;
  iniciado: boolean;
  PesoActualDesmoldado: number;
  TiempoTranscurrido: number;
}

export interface ProcessData {
  Desmoldeo: DesmoldeoData;
  Encajonado: any[];
  Palletizado: any[];
}

export interface GripperData {
  NGripperActual: number;
  NGripperProximo: number;
}

export interface RobotData {
  posicionX: number;
  posicionY: number;
  posicionZ: number;
}

export interface DesmoldeoTechnicalData {
  cicloTiempoTotal: number;
  cicloTipoFin: number;
  desmoldeobanda: number;
}

export interface TowerData {
  N_torre_actual: number;
  N_torre_proxima: number;
  TotalNiveles: number;
}

export interface SddaData {
  sdda_long_mm: number;
  sdda_nivel_actual: number;
  sdda_vertical_mm: number;
}

export interface SectorIOData {
  banda_desmoldeo: string;
  estado_ciclo: boolean;
}

export interface TechnicalData {
  datosGripper: GripperData;
  datosRobot: RobotData;
  datosDesmoldeo: DesmoldeoTechnicalData;
  datosTorre: TowerData;
  datosSdda: SddaData;
  sector_IO: SectorIOData;
}

export interface Alarm {
  id_alarma: number;
  estadoAlarma: boolean;
  tipoAlarma: string;
  descripcion: string;
  fechaRegistro: string;
}

export interface WebSocketResponse {
  machineStatus: MachineStatus;
  processData: ProcessData;
  technicalData: TechnicalData;
  alarms: Alarm[];
  extraData: any[];
}
