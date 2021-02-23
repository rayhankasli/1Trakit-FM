/**
 * BaseResponse
 * @author Ronak Patel.
 * @description
 */
export class BaseResponse<T> {
    /**
     * Error  of base response
     */
    public error: string;
    /**
     * Result  of base response
     */
    public result: T;
}
