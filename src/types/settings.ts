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

interface basicZone {
  COD_ZONA:number
  TIPO_ZONA:string
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