import { PaperType } from '../copyits.model';
import { CopyItPageType, CopyItPriceQuote, CopyItProof } from './copy-it.enum';
import { PriceQuote, Proof } from './copyit-shared.model';

export const copyItPageTypes: PaperType[] = [
    {
        paperType: 'Both',
        paperTypeId: CopyItPageType.BOTH
    },
    {
        paperType: 'Cover',
        paperTypeId: CopyItPageType.COVER
    },
    {
        paperType: 'Back',
        paperTypeId: CopyItPageType.BACK
    },
];

export const COPYIY_PROOFS: Proof[] = [
    {
        isProof: CopyItProof.YES,
        proofValue: 'Yes'
    },
    {
        isProof: CopyItProof.NO,
        proofValue: 'No'
    }
];

export const COPYIY_PRICE_QUOTE: PriceQuote[] = [
    {
        isPriceQuote: CopyItPriceQuote.YES,
        priceQuoteValue: 'Yes'
    },
    {
        isPriceQuote: CopyItPriceQuote.NO,
        priceQuoteValue: 'No'
    }
];