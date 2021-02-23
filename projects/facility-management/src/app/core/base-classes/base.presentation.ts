import { trackBy } from '../utility/utility';

/**
 * Base presentaion class for listing
 */
export class BasePresentation {
    constructor() { }

    /** Used for performance optimization. */
    public trackBy(key: string, index: number, data: any): number {
        return trackBy(key, index, data);
    }
}