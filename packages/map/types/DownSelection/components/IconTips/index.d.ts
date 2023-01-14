/// <reference types="react" />
type Props = {
    title?: string;
    style?: any;
    click?: Function;
    component: any;
    trigger?: string[] | string;
};
export default function index({ title, style, click, component, trigger }: Props): JSX.Element;
export {};
