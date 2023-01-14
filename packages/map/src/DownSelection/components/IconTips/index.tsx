/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-interface */
import React from 'react';
import Icon from '@ant-design/icons';
import {Tooltip} from 'antd';

type Props = {
    title?:string,
    style?:any,
    click?:Function,
    component:any,
    trigger?:string[]|string
}

export default function index({title='',style={},click,component,trigger}: Props) {
    return (
        <Tooltip title={title} trigger={trigger}>
            <Icon style={{
                fontSize:'22px',
                marginRight:'16px',
                ...style
                
            }}
            component={component}
            onClick={(e)=>{
                e.stopPropagation();
                e.preventDefault();
                click&&click();
            }}
 
            ></Icon>
        </Tooltip>
    );
}