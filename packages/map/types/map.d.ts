import { FunctionComponent } from 'react';
import './index.less';
interface MapProps {
    originToDestination: any;
    routings: any[];
    routingsCoordinate: Array<number>;
    trcks: Array<number>;
    lineColor: string;
    mainMapLine: boolean;
    AMapSecurityJsCode: string;
    AMapKey: string;
    defaultMap?: string;
    styles?: any;
    changeMap?: boolean;
    modeCode?: string;
    statusCode?: string;
    isWaybill?: boolean;
    scrollHight?: string;
    id?: string;
}
declare const MapComp: FunctionComponent<MapProps>;
export default MapComp;
