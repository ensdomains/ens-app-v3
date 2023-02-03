import * as React from 'react';
type NativeImgAttributes = React.ImgHTMLAttributes<HTMLImageElement>;
type Shape = 'circle' | 'square';
export type Props = {
    /** Accessibility text. */
    label: string;
    /** If true, removes the border around the avatar. */
    noBorder?: boolean;
    /** Uses tokens space settings to set the size */
    src?: NativeImgAttributes['src'];
    /** The shape of the avatar. */
    shape?: Shape;
    /** A placeholder for the image to use when not loaded, in css format (e.g. url("https://example.com")) */
    placeholder?: string;
    /** If true sets the component into disabled format. */
    disabled?: boolean;
} & Omit<NativeImgAttributes, 'alt' | 'onError' | 'children' | 'onError'>;
export declare const Avatar: {
    ({ label, noBorder, shape, src, placeholder, decoding, disabled, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
