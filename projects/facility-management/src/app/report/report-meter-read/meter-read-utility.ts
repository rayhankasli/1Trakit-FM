import { MeterReadList, PaperType } from './report-meter-read.model';

/** MeterReadList Data */
export function getMeterReadList(item: MeterReadList[]): MeterReadList[] {
  let meterReadList: MeterReadList[] = [];
  item.forEach((e: MeterReadList) => {
    let meterRead: MeterReadList = new MeterReadList(
    e.location,
    e.model,
    e.serialNo,
    e.assetTagNo,
    e.meter,
    e.colorRate,
    e.bwRate,
    e.paperType,
    e.begin,
    e.end,
    e.end - e.begin);
    let copies: number = e.end - e.begin
    if (e.paperType === PaperType.BW) { 
      meterRead.cost = (copies > 0 ? copies * e.bwRate : 0); 
    } else {
      meterRead.cost = (copies > 0 ? copies * e.colorRate : 0);
    }
    meterReadList.push(meterRead);
  });
  return meterReadList;
}
