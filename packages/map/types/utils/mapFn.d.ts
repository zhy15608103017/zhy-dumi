declare const MapBoxGL: any;
export default MapBoxGL;
export declare function CreateMap(option: any): any;
export declare function getLnglat(p: any): any[];
export declare function getLnglatList(p: any[]): any[][];
/**
 * 判断当前的坐标符合[lng, lat]格式
 * @param {array} line: [lng, lat]
 */
export declare function isLngLat(lnglat: any): any;
export declare function getDrivingPath(routing: any): Promise<{
    line: any;
    routing: any;
}>;
export declare function greatCircle(routing: any): any;
export declare function fitbounds(map: any, paths: any, padd?: {}): void;
export declare function getRoute(routing: any): Promise<{
    line: any;
    routing: any;
}>;
export declare function getPlanePath(routing: any): Promise<{
    line: any;
    routing: any;
}>;
export declare function getSeaPath(routing: any): Promise<{
    line: any;
    routing: any;
}>;
