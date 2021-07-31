
export interface ProductType {
    token?;
    fetchBlob(resourceId: string, priority: number): Promise<string>;
    getListResources(priority : number): Array<any>;
    getName(): String;
    getPolicyId() : String;
    getAccordionItemsInterface() : Promise<Array<any>>;
    loadResource(): Promise<Array<any>>;
    loadCarousel(): Promise<Array<any>>;
    loadDefaultResource(): Promise<string>;
    getProductType(): String;
    getNativeTokenId(): String;
    
}