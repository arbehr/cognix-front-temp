export class Contribuinte {
    papel: String;
    entidade: String[];
    data: String;
}




export class Metadata {
    localizacao: String[];
    titulo: String[];
    idioma: String[];
    descricao: String[];
    catalogo: String;
    identificador: String;
    palavraChave: String[];
    // cobertura: String[];
    estrutura: String;
    agregacao: String;
    versao: String;
    estado: String;
    contribuinte: Contribuinte[];
    papel: String;
    custo: String;
    direitos: String;
    condicoes: String;
    tipoInteratividade: String;
    publicoAlvo: String[];
    tipoRecurso: String[];
    nivelInteratividade: Number;
    densidadeSemantica: Number;
    nivelDificuldade: Number;
    intervaloIdade: Number[];
    tempoAprendizado: String;
    descricaoEducacional: String[];
    idiomaEducacional: String[];
    contexto: String[];
    tipoConteudo: String;
    tipoInteracao: String;
    percepcao: String;
    sincronismo: String;
    copresenca: String;
    reciprocidade: String;
    visual: String;
    auditivo: String;
    textual: String;
    tatil: String;
  }

  export class OBAA {
    
        id: Number;
        obaaEntry: String;
        isVersion: String;
        hasVersion: String;
        //files: [];
        metadata: {
            general: {
                titles: String[];
                keywords: String[];
                descriptions: String[];
                identifiers: 
                    {
                        catalog: String;
                        entry: String;
                    }[];
                languages: String[];
                //thumbnails: []
            },
            lifeCycle: {
                contribute:
                    {
                        role: String;
                        entities:String[];
                    }[];
            }
            technical: {
                location: String[];
                size: String,
                //requirement: [],
                supportedPlatforms: String[],
                //platformSpecificFeatures: [],
                //"service": [],
                formats: String[]
            },
            educational: {
                learningResourceTypes: String[],
                interactivityLevel: String;
                intendedEndUserRoles: String[],
                contexts: String[],
                typicalLearningTime: String,
                knowledgeAreas: String[],
            },
            rights: {
                cost: String,
                copyright: String,
                description: String,
            }
            metametadata: {
                identifier: 
                    {
                        catalog: String;
                        entry: String;
                    }[];
                contribute:
                    {
                        role: String;
                        entity:String[];
                        date: String;
                    }[];
                metadataSchema: String[];
                language: String;
            },
            relations: {
                kind: String;
                resource: {
                    identifier: 
                    {
                        catalog: String;
                        entry: String;
                    }[];
                }
            }[],
            //"annotations": [],
            //"classifications": []
        }
    
  }


  export class OBAACreator{
    id: Number;
    obaaEntry: String;
    isVersion: String;
    hasVersion: String;
    //files: null,
    metadata: {
        general: {
            titles: String[];
            keywords: String[];
            descriptions: String[];
            identifiers: 
                {
                    catalog: string;
                    entry:  string;
                }[];
            languages: String[];
            //thumbnails: []
        },
        lifeCycle: {
            contribute:
            {
                role: string;
                entities: String[];
            }[];
        }
        technical: {
            location: String[];
            //requirement: [],
            supportedPlatforms: String[];
            //platformSpecificFeatures: [],
            //service: [],
            formats: String[];
        },
        educational: {
            learningResourceTypes: String[];
            interactivityLevel: string;
            intendedEndUserRoles: String[];
            contexts: String[];
            typicalLearningTime: String; 
            knowledgeAreas: String[];
        },
        rights: {
            cost: String;
            copyright: String;
            description: String;
        }
        relations: {
            kind: String;
            resource: {
                identifier: 
                {
                    catalog: string;
                    entry:  string;
                }[];
            }
        }[],
        //annotations: [],
        //classifications: []
    }
  }