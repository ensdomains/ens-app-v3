import * as React from 'react';
declare type NativeImgAttributes = React.ImgHTMLAttributes<HTMLImageElement>;
declare type Shape = 'circle' | 'square';
export declare type Props = {
    /** Accessibility text. */
    label: string;
    /** If true, removes the border around the avatar. */
    noBorder?: boolean;
    /** Uses tokens space settings to set the size */
    src?: NativeImgAttributes['src'];
    /** The shape of the avatar. */
    shape?: Shape;
} & Omit<NativeImgAttributes, 'decoding' | 'alt' | 'onError' | 'children' | 'onError'>;
export declare const Avatar: {
    ({ label, noBorder, shape, src, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
