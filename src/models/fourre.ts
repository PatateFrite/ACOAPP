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
    
    luggageCount?:      Number;
    luggageAvgWeight?:  Number;
    luggageTotalWeight?:Number;
    lfcCpt1:            Number;
    lfcCpt3:            Number;
    lfcCpt4:            Number;
    lfcCpt5:            Number;
    lfcCpt1Poids:       Number;
    lfcCpt3Poids:       Number;
    lfcCpt4Poids:       Number;
    lfcCpt5Poids:       Number;
    



}

export interface IInbound {
    flight:             Number;
    destination:        String;
}