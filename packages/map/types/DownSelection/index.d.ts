import { ReactElement } from 'react';
import './index.less';
import React from 'react';
interface Parameter {
    page: number;
    value?: string;
}
interface Props {
    defaultData: any;
    code: string;
    name: string;
    itemClick?: (data: any) => void;
    goBack?: () => void;
    goBackTip?: string;
    lable?: string;
    placeholder?: string;
    total?: number;
    TriggerFunction?: (data: Parameter) => void;
    data: any[];
    IconMap?: {
        'downIcon'?: React.ForwardRefExoticComponent<any>;
        'goBackIcon'?: React.ForwardRefExoticComponent<any>;
        'CheckIcon'?: React.ForwardRefExoticComponent<any>;
    };
}
export default function DownSelection({ defaultData, goBack, lable, placeholder, total, name, itemClick, goBackTip, code, data, TriggerFunction, IconMap }: Props): ReactElement;
export {};
