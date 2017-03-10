export interface IFourre {
    _id:                String;
    created:            Date;
    time?:              Object;
    flight:             String;
    prefix:             String;
    destination?:       String;
    position?:          String;
    gate?:              String;
    planeType:          String;
    std?:               String;
    etd?:               String;
    sta?:               String;
    ata?:               String;
    atc?:               Array<IInbound>;
    slot?:              String;
    inbound?:           String;
    crew?:              Array<String>;
    zones?:             Object;
    
    luggageCount?:      number;
    luggageAvgWeight?:  number;
    luggageTotalWeight?:number;
    zonesLfcA:          number;
    zonesLfcB:          number;
    zonesLfcC:          number;
    lfcCpt1:            number;
    lfcCpt3:            number;
    lfcCpt4:            number;
    lfcCpt5:            number;
    lfcCpt1Poids:       number;
    lfcCpt3Poids:       number;
    lfcCpt4Poids:       number;
    lfcCpt5Poids:       number;
}

export interface IInbound {
    flight:             Number;
    destination:        String;
}