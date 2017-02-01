export interface IFourre {
    _id:                String;
    created:            Date;
    time?:              String;
    std?:               Date;
    etd?:               Date;
    sta?:               Date;
    ata?:               Date;
    slot?:              Date;
    inbound?:           Date;
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