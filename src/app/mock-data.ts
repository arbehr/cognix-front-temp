import { Contribuinte, Metadata, OBAA, OBAACreator } from './metadata';


export const contrib: Contribuinte[] = [{
    papel: 'a',
    entidade: ['as'],
    data: '30/07/2018'

}];

export const Mock: Metadata = {
    localizacao: ['a'],
    titulo:  ['Something'],
    idioma:  ['Português'],
    descricao:  ['as'],
    catalogo: 'URI',
    identificador: '1',
    palavraChave:  ['asdz'],
    estrutura: 'Linear',
    agregacao: 'bs',
    versao: '2.0',
    estado: 'Finalizado',
    contribuinte: contrib,
    papel: 'teste',
    custo: 'aaaaa',
    direitos: 'bh',
    condicoes: 'bj',
    tipoInteratividade: 'bk',
    publicoAlvo:  ['ad'],
    tipoRecurso:  ['as'],
    nivelInteratividade: 2,
    densidadeSemantica: 3,
    nivelDificuldade: 2,
    intervaloIdade: [2],
    tempoAprendizado: 'ssb',
    descricaoEducacional:  ['az'],
    idiomaEducacional:  ['ax'],
    contexto:  ['ac'],
    tipoConteudo: 'bd',
    tipoInteracao: 'dszza',
    percepcao: 'db',
    sincronismo: 'baaaa',
    copresenca: 'bsss',
    reciprocidade: 'bzz',
    visual: 'bq',
    auditivo: 'bw',
    textual: 'bx',
    tatil: 'bc'

};


export const emptyContrib: Contribuinte[] = [{
    papel: '',
    entidade: [''],
    data: ''

}];

export const emptyMock: Metadata = {
    localizacao: [''],
    titulo:  [''],
    idioma:  [''],
    descricao:  [''],
    catalogo: '',
    identificador: '',
    palavraChave:  [''],
    estrutura: '',
    agregacao: '',
    versao: '',
    estado: '',
    contribuinte: emptyContrib,
    papel: '',
    custo: '',
    direitos: '',
    condicoes: '',
    tipoInteratividade: '',
    publicoAlvo:  [''],
    tipoRecurso:  [''],
    nivelInteratividade: 1,
    densidadeSemantica: 1,
    nivelDificuldade: 1,
    intervaloIdade: [1],
    tempoAprendizado: '',
    descricaoEducacional:  [''],
    idiomaEducacional:  [''],
    contexto:  [''],
    tipoConteudo: '',
    tipoInteracao: '',
    percepcao: '',
    sincronismo: '',
    copresenca: '',
    reciprocidade: '',
    visual: '',
    auditivo: '',
    textual: '',
    tatil: ''

};

export const emptyMockOBAA: OBAA = 
    {
        id: 1,
        obaaEntry: "http://cognitivabrasil.com.br/repositorio/documents/1",
        isVersion: null,
        hasVersion: null,
        //files: [],
        metadata: {
            general: {
                titles: ["aaa"],
                keywords: ["sss"],
                descriptions: ["xxx"],
                identifiers: [
                    {
                        catalog: "URI",
                        entry: "http://cognitivabrasil.com.br/repositorio/documents/1"
                    }
                ],
                languages: ["zzz"],
               // "thumbnails": []
            },
            lifeCycle: {
                contribute: [
                    {
                        role: "Autor",
                        entities: [
                            "name"
                        ],
                    }
                ],
            },
            technical: {
                location: [
                    "http://cognitivabrasil.com.br/repositorio/documents/1"
                ],
                size: "0",
               // "requirement": [],
                supportedPlatforms: [
                    "aaa"
                ],
                //"platformSpecificFeatures": [],
                //"service": [],
                "formats": [
                    ".xmls"
                ]
            },
            educational: {
                learningResourceTypes: ["Questionário", "Jogo"],
                interactivityLevel: "Média",
                intendedEndUserRoles: ["Estudante"],
                contexts: ["Ensino básico pré-escolar"],
                typicalLearningTime: "PT1H30M",
                knowledgeAreas: ["Ciências humanas"],
            },
            rights: {
                cost: "no",
                copyright: "yes",
                description: "CC BY-NC-SA",
            },
            metametadata: {
                identifier: [
                    {
                        catalog: "URI",
                        entry: "http://www.w3.org/2001/XMLSchema-instance"
                    }
                ],
                contribute: [
                    {
                        role: "Autor",
                        entity: [
                            "usuario@logado.com "
                        ],
                        date: "11/04/2019"
                    }
                ],
                metadataSchema: [
                    "OBAAv1.0",
                    "OBAAv1.0",
                    "OBAAv1.0"
                ],
                language: "Português"
            },
            //"relations": [],
            //"annotations": [],
            //"classifications": []
        }
    }

    export const emptyMockOBAACreator = {
        id: 0,
        obaaEntry: "http://cognitivabrasil.com.br/repositorio/documents/",
        isVersion: "s",
        hasVersion: "s",
       // files: null,
        metadata: {
            general: {
                titles: ["a"],
                keywords: ["a"],
                descriptions: ["s"],
                identifiers: [
                    {
                        catalog: "URI",
                        entry: "http://www.w3.org/2001/XMLSchema-instance"
                    }
                ],
                languages: ["s"],
                //thumbnails: []
            },
            lifeCycle: {
                contribute: [
                    {
                        role: "autor",
                        entities: ["entidade"],
                    }
                ],
            },
            technical: {
                location: ["s"],
              //  requirement: [],
                supportedPlatforms: ["s"],
               // platformSpecificFeatures: [],
               //service: [],
                formats: ["s"]
            },
            educational: {
                learningResourceTypes: ["q", "t"],
                interactivityLevel: "nula",
                intendedEndUserRoles: ["e"],
                contexts: ["ens"],
                typicalLearningTime: "s",
                knowledgeAreas: ["ciencia"],
            },
            rights: {
                cost: "no",
                copyright: "yes",
                description: "cc",
            }
            //relations: [],
          //annotations: [],
        //    classifications: []
        }
    }