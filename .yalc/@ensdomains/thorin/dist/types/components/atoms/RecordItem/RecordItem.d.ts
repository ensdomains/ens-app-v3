import { ReactNode } from 'react';
declare type Screen = 'desktop' | 'mobile';
declare type Size = 'small' | 'large';
declare type BaseProps = {
    value: string;
    link?: string;
    screen?: Screen;
    size?: Size;
    icon?: ReactNode;
    keyLabel?: string | ReactNode;
    keySublabel?: string | ReactNode;
    children: string;
    onClick?: () => void;
};
export declare type Props = BaseProps;
export declare const RecordItem: {
    ({ link, screen, size, icon, keyLabel, keySublabel, value, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
