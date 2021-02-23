
/**
 * @author Rayhan Kasli.
 * @description model file which contain all model and enum for this module
 */
import { InjectionToken } from '@angular/core'; 
import { SortingOrder } from 'common-libs';


/** model class for meter read */
export class MeterRead {

    /** assetId contain asset id */
    public assetId: number;
    /** manufacturer contain manufacturer name */
    public manufacturer: string;
    /** assetNo contain asset number */
    public assetNo: string;
    /** modelNo contain model number */
    public modelNo: string;
    /** total contain total numbers of meter read */
    public total: number;
    /** meterReadList contain List of meter reads data */
    public meterReadDetail: MeterReadList[];
    /** meterReadList contain List of meter reads data */
    public pageNumber?: number;
     /** totalCostBw  of MeterRead */
    public totalBwCopies: number;
    /** totalCostBw  of MeterRead */
    public totalBwCost: number;
     /** totalCostBw  of MeterRead */
    public totalColorCopies: number;
     /** totalCostBw  of MeterRead */
    public totalColorCost: number;

    constructor(
        assetId: number,
        manufacturer: string,
        assetNo: string,
        modelNo: string,
        total: number,
        meterReadDetail: MeterReadList[],
        totalBwCopies: number,
        totalBwCost: number,
        totalColorCopies: number,
        totalColorCost: number
    ) {
        this.assetId = assetId;
        this.manufacturer = manufacturer;
        this.assetNo = assetNo;
        this.modelNo = modelNo;
        this.total = total;
        this.meterReadDetail = meterReadDetail;
        this.totalBwCopies = totalBwCopies;
        this.totalBwCost = totalBwCost;
        this.totalColorCopies = totalColorCopies;
        this.totalColorCost = totalColorCost;
    }
}



/** model class for MeterReadList */
export class MeterReadList{
                
    /** floorLocation  of MeterRead */
    public location: string;
                
    /** model  of MeterRead */
    public model: string;
                
    /** serialNumber  of MeterRead */
    public serialNo: string;
                
    /** id  of MeterRead */
    public assetTagNo: number;
                
    /** meter  of MeterRead */
    public meter: string;
                
    /** color rate of meterRead */
    public colorRate: number;
    /** bw rate of meterRead */
    public bwRate: number;

    /** begin  of MeterRead */
    public begin: number;
                
    /** end  of MeterRead */
    public end: number;
                
    /** copies  of MeterRead */
    public copies: number;
                
    /** cost  of MeterRead */
    public cost: number;
    /** cost  of MeterRead */
    public paperType: number;

    constructor(
        location?: string,   
        model?: string,   
        serialNo?: string,   
        assetTagNo?: number,   
        meter?: string,   
        colorRate?: number,
        bwRate?: number,
        paperType?: number,
        begin?: number,   
        end?: number,   
        copies?: number,   
        cost?: number
    ) {
        this.location = location;
        this.model = model;
        this.serialNo = serialNo;
        this.assetTagNo = assetTagNo;
        this.meter = meter;
        this.colorRate = colorRate;
        this.bwRate = bwRate;
        this.paperType = paperType;
        this.begin = begin;
        this.end = end;
        this.copies = copies;
        this.cost = cost;
    }
}
/** Model class for sortRecord. */
export class MeterReadSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}


    
export const METERREAD_SORT: InjectionToken<MeterReadSortRecord> = new InjectionToken<MeterReadSortRecord>('meterReadSort');


/** enum for select paper type */
export enum PaperType {
    BW = 1,
    Color = 2
}