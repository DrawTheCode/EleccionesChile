export interface candidateSchema {
  COD_CAND:number
  COD_ELEC:number
  COD_ZONA:number
  CAN_ORDEN:number | null
  GLOSA_CAND:string | null
  COD_PART:number | null
  COD_PACTO:number | null
  COD_SUBP:number | null
  COD_IND:string | null
  CAN_PAGINA: number | null
  GLOSA_NOMBRE: string | null
  GLOSA_APELLIDO:string | null
  COD_GENERO:string | null
}

export interface electionsSchema {
  COD_ELEC: number
  GLOSA_ELEC:string
  ELE_FECHA:string
  TIPO_ZONA:string
  TIPO_ELECCION:string
  TOTAL_ELECTORES:number
}

interface basicZone {
  COD_ZONA:number
  TIPO_ZONA:string
}

export interface pactSchema {
  COD_PACTO: number
  LETRA_PACTO:string
  GLOSA_PACTO:string
}

export interface partiesSchema {
  COD_PART: number
  GLOSA_PART: string
  SIGLA_PART: string
}

export interface subPactSchema {
  COD_SUBP: number
  LETRA_PACTO:string
  GLOSA_SUBP:string
}

export interface ZoneSchema extends basicZone{
  GLOSA_ZONA: string
  ORDEN_ZONA: number
}

export interface FatherZoneSchema  extends basicZone{
  COD_ZONA_PAD: number
  TIPO_ZONA_PAD: string
}

export interface voteSchema extends basicZone{
  COD_ELEC: number
  AMBITO: number
  COD_AMBITO: number
  VOTOS:number
}

export interface fileShcemas {
  name: string
  id: number
  version: number
  correlative:number
}
export interface fileResultsShcemas {
  name: string
  id: number
  percent: number
  hour:string
}