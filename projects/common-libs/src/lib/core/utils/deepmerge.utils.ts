
/** DeepMerge */
export class DeepMerge {

    /** deepMergeAll */
    public deepMergeAll(array: object[], options?: any): object {
        if (!Array.isArray(array)) {
            throw new Error('first argument should be an array');
        }
        return array.reduce((prev: any, next: any) => {
            return this.deepmerge(prev, next, options);
        },                  {});
    }

    /** isMergeableObject */
    public isMergeableObject(value: any): boolean {
        return this.isNonNullObject(value) && !this.isSpecial(value);
    }

    /** isSpecial */
    public isSpecial(value: any): boolean {
        const stringValue: any = Object.prototype.toString.call(value);

        return stringValue === '[object RegExp]' || stringValue === '[object Date]';
    }

    /** isNonNullObject */
    public isNonNullObject(value: any): boolean {
        return !!value && typeof value === 'object';
    }

    /** emptyTarget */
    public emptyTarget(val: any): any {
        return Array.isArray(val) ? [] : {};
    }

    /** defaultArrayMerge */
    public defaultArrayMerge(target: any, source: any, options: any): any {
        return target.concat(source).map((element: any) => {
            return this.cloneUnlessOtherwiseSpecified(element, options);
        });
    }

    /** cloneUnlessOtherwiseSpecified */
    public cloneUnlessOtherwiseSpecified(value: any, options: any): any {
        return (options.clone !== false && this.isMergeableObject(value))
            ? this.deepmerge(this.emptyTarget(value), value, options) : value;
    }

    /** mergeObject */
    public mergeObject(target: any, source: any, options: any): any {
        const destination: any = {};
        if (this.isMergeableObject(target)) {
            Object.keys(target).forEach((key: any) => {
                destination[key] = this.cloneUnlessOtherwiseSpecified(target[key], options);
            });
        }
        Object.keys(source).forEach((key: any) => {
            if (!this.isMergeableObject(source[key]) || !target[key]) {
                destination[key] = this.cloneUnlessOtherwiseSpecified(source[key], options);
            } else {
                destination[key] = this.deepmerge(target[key], source[key], options);
            }
        });
        return destination;
    }

    /** deepmerge */
    public deepmerge(target: any, source: any, options: any): any {
        options = options || {};
        const sourceIsArray: boolean = Array.isArray(source);
        const targetIsArray: boolean = Array.isArray(target);
        const sourceAndTargetTypesMatch: boolean = sourceIsArray === targetIsArray;
        if (!sourceAndTargetTypesMatch) {
            return this.cloneUnlessOtherwiseSpecified(source, options);
        } else if (sourceIsArray) {
            return this.defaultArrayMerge(target, source, options);
        } else {
            return this.mergeObject(target, source, options);
        }
    }

}