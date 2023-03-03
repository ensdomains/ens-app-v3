import { ReactNode } from 'react';
type Size = 'small' | 'large';
type BaseProps = {
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
export type Props = BaseProps;
export declare const RecordItem: {
    ({ link, size, inline, icon, keyLabel, keySublabel, value, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
