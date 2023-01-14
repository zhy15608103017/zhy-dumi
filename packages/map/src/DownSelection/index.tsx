/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import { ReactElement, useState, useEffect, useRef } from 'react';
import './index.less';
import { Spin ,Tooltip} from 'antd';
import IconTipx from './components/IconTips';
import { throttle } from 'lodash';
import { useClickAway } from 'ahooks';
import React from 'react';

import IconParkDown from '../assets/newIcon/iconPark-down.svg';
import  Iconwithdrawal from '../assets/newIcon/iconPark-folder-withdrawal.svg';
import  Iconsmall  from '../assets/newIcon/iconPark-check-small.svg';
interface Parameter {
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    page: number,
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    value?: string
}
interface Props {
    // 默认展示
    // eslint-disable-next-line @typescript-eslint/member-delimiter-style
    // 默认数据
    defaultData: any,

    // 对应数据唯一值
    code: string,
    // 想要展示数据的那个字段
    name: string,
    // 点击item触发的函数
    itemClick?: (data: any) => void,
    // 放回触发函数
    goBack?: () => void,
    // 返回按钮提示
    goBackTip?: string,
    // 展示的title
    lable?: string,
    // 搜索框默认值
    placeholder?: string,
    // 数据总量判断是否展示滚动条
    total?: number,
    // 滚动’初次加载’搜索触发的函数 的函数
    TriggerFunction?: (data: Parameter) => void,
    // 初始数据
    data: any[],
    // 图标对象
    IconMap?: {
        // 下拉图标
        'downIcon'?: React.ForwardRefExoticComponent<any>,
        // 返回图标
        'goBackIcon'?: React.ForwardRefExoticComponent<any>,
        // 选中图标
        'CheckIcon'?: React.ForwardRefExoticComponent<any>,
    }
}

export default function DownSelection({
    defaultData={},
    goBack = () => {} ,
    lable = '菜单目录',
    placeholder = '请搜索',
    total = 11,
    name = 'name',
    itemClick = () => { },
   
    goBackTip = '返回',
    code,
    data = [],
    TriggerFunction = (data: Parameter) => {},
    IconMap = {
  
    }
}: Props): ReactElement {
    const {downIcon, goBackIcon,CheckIcon}=IconMap;
    const dropDownListRef = useRef<HTMLDivElement>(null);
    const downSelectionRef = useRef<HTMLDivElement>(null);
    const [downState, setDownState] = useState(false);
    const searchKeyword = useRef('');
    const initialization = useRef(false);
    const page = useRef(1);
    const [listRandr, setListRandr] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollFn = async () => {
        page.current += 1;
        setLoading(true);
        await TriggerFunction({
            value: searchKeyword.current,
            page: page.current
        });
        setLoading(false);
    };
    const throttlescrollFn = throttle(scrollFn, 300);
    useClickAway(() => {
        setDownState(false);
    }, downSelectionRef);
    const getList = () => {
        let listArr = [...data];
        let index = listArr.findIndex((item: any) => {
            return item[code] === defaultData[code];
        });
        index !== -1 && listArr.splice(index, 1);
        setListRandr((old) => {

            if (initialization.current) return listArr;
            return old.concat(listArr);
        });
    };
    const serach = async (value: string) => {
        initialization.current = true;
        page.current = 0;
        setLoading(true);
        await TriggerFunction({
            page: page.current,
            value: value
        });
        setLoading(false);
    };
    useEffect(() => {
        if (downState) {
            serach('');
        }
    }, [downState]);
    useEffect(() => {
        getList();
    }, [data]);
    useEffect(() => {
        searchKeyword.current = '';
        if (dropDownListRef?.current) {
            dropDownListRef.current.onscroll = function (e) {
                if ((e?.target as HTMLElement ).scrollTop >= (page.current - 1) * 300) {
                    initialization.current = false;
                    throttlescrollFn();
                }
            };
        }
    }, [downState]);
    return (
        <div className={"juslinkCommondownSelection"} ref={downSelectionRef}>
            <div className={"juslinkCommondescribe"} title={defaultData[name]}>{lable}: {defaultData[name]}</div>
            <div className={"juslinkCommondownBtn"}>
                {downIcon?           <IconTipx style={{
                    marginRight: '8px',
                    transform: !downState ? 'rotate(0deg)' : 'rotate(180deg)',
                    cursor: 'pointer'
                }}
                component={downIcon}
                click={() => {
                    setDownState(!downState);
                }}

                />:
                    <img style={{
                        marginRight: '8px',
                        transform: !downState ? 'rotate(0deg)' : 'rotate(180deg)',
                        cursor: 'pointer'
                    }}
                    src={IconParkDown}
                    onClick={() => {
                        setDownState(!downState);
                    }}

                    />}
                { goBackIcon?<IconTipx style={{
                    borderLeft: '1px solid  #FFC500',
                    fontSize: '16px',
                    marginRight: '0px',
                    paddingLeft: '8px',
                    cursor: 'pointer'


                }}
                title={goBackTip}
                click={() => {
                    goBack();
                }}
                component={goBackIcon} />:
                    <Tooltip    title={goBackTip}>
                        <img style={{
                            borderLeft: '1px solid  #FFC500',
                            fontSize: '16px',
                            marginRight: '0px',
                            paddingLeft: '8px',
                            cursor: 'pointer'


                        }}
 
                        onClick={() => {
                            goBack();
                        }}
                        src={Iconwithdrawal}
                        />
                    </Tooltip>}                        
            </div>
            {downState ? <div className={"juslinkCommondropDown"}  >
                <Spin spinning={loading}>
                    <input type='text' className={"juslinkCommoninput"} placeholder={placeholder} onChange={(e) => {
                        serach(e.target.value);
                        searchKeyword.current = e.target.value;
                    }} />

                    <div className={"juslinkCommondropDownList"} ref={dropDownListRef} id='dropDownList' style={{
                        overflowY: total > 10 ? 'scroll' : 'auto'
                    }}>
                        <div className={"juslinkCommonli"} title={defaultData[name]} onClick={
                            () => {
                                setDownState(false);
                            }
                        }>
                            < span  > {defaultData[name]} </span>
                            {      CheckIcon? <IconTipx
                                style={{
                                    marginRight: '0px',
                                    cursor: 'pointer'
                                }}
                                component={CheckIcon}
                            ></IconTipx>:
                                <img
                                    style={{
                                        marginRight: '0px',
                                        cursor: 'pointer'
                                    }}
                                    src={Iconsmall}
                                ></img>}

                        </div>
                        {listRandr?.map((Item: any) => {

                            return (<div className={"juslinkCommonli"} key={Item[code]} title={Item[name]} onClick={
                                () => {
                                    setDownState(false);
                                    itemClick(Item);
                                }
                            }>
                                <span>     {Item[name]} </span>


                            </div>);
                        })}



                    </div>

                </Spin> </div> : null}
        </div>
    );
}
