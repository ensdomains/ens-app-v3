import { ReactNode } from 'react';
declare type Size = 'small' | 'large';
declare type BaseProps = {
    value: string;
    link?: string;
    size?: Size;
    inline?: boolean;
    icon?: ReactNode;
    keyLabel?: string | ReactNode;
    keySublabel?: string | ReactNode;
    children: string;
    onClick?: () => void;
};
export declare type Props = BaseProps;
export declare const RecordItem: {
    ({ link, size, inline, icon, keyLabel, keySublabel, value, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
