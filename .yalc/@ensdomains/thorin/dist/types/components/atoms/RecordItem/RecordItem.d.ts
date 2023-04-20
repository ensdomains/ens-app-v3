import * as React from 'react';
import { ReactNode } from 'react';
import { Neverable } from '../../../types';
type Size = 'small' | 'large';
type BaseProps = {
    value: string;
    size?: Size;
    inline?: boolean;
    icon?: ReactNode;
    keyLabel?: string | ReactNode;
    keySublabel?: string | ReactNode;
    children: string;
    onClick?: () => void;
    as?: 'button' | 'a';
};
type NativeElementProps = Omit<React.HTMLAttributes<HTMLElement>, keyof BaseProps>;
type NativeButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof NativeElementProps | keyof BaseProps>;
type NativeAnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NativeElementProps | keyof BaseProps>;
type AsAnchorProps = {
    as: 'a';
    link?: string;
} & Neverable<NativeButtonProps, NativeAnchorProps> & NativeAnchorProps;
type AsButtonProps = {
    as?: 'button';
    link?: never;
} & Neverable<NativeAnchorProps, NativeButtonProps> & NativeButtonProps;
export type Props = BaseProps & NativeElementProps & (AsAnchorProps | AsButtonProps);
export declare const RecordItem: {
    ({ as: asProp, link, size, inline, icon, keyLabel, keySublabel, value, children, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
