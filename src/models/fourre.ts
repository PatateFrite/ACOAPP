export interface IFourre {
    _id:                String;
    created:            Date;
    time?:              String;
    std?:               String;
    etd?:               String;
    sta?:               String;
    ata?:               String;
    slot?:              String;
    inbound?:           String;
    flight?:            String;
    destination?:       String;
    position?:          String;
    gate?:              String;
    crew?:              Array<String>;
    zones?:             Object;
    luggageCount?:      Number;
    luggageAvgWeight?:  Number;
    luggageTotalWeight?:Number;
}