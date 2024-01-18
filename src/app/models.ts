export interface Linhas {
    linhas: LinhaX[]
  }

export interface LinhaX {
    consorcio: string
    tarifa: number
    codigo: string
    veiculos: Veiculo[]
    rotas: Rota[]
    corredor: any
    id: number
    tp: string
    velocidadeMedia: number
    ts: string
    mediaHistorica: number
    status: string
}
  
export interface Veiculo {
    consorcio: string
    empresa: string
    prefixo: string
    codigoLinha: string
    sentidoLinha: string
    idRota: number
    dataUltimaTransmissao: number
    latitude: number
    longitude: number
    seqPonto: number
    acessibilidade: string
    capacidadeSentados: number
    capacidadeEmPe: number
    dataAutorizacao: number
    placa: string
    idVeiculo: number
    alertaNaoTransmitiuCiclo: boolean
    dentroRota: boolean
}
  
export interface Rota {
    consorcio: string
    encode: any
    tarifa: number
    cidade: string
    sequencia: number
    pontos: Ponto[]
    corredor: any
    tempo: number
    qtdPontos: number
    idTipoSentido: number
    horarios: string
    sentido: string
    distancia: number
    raioCerca: number
    idEmpresa: any
    destino: string
    id: number
    idLinha: number
    tp: string
    codigoLinha: string
    status: string
    ts: string
    horariosdiasuteis: string
    horariossabados: string
    horariosdomingosferiados: string
}
  
export interface Ponto {
    latitude: number
    longitude: number
    endereco: string
    raio: number
    sequencia: number
    id: number
}
