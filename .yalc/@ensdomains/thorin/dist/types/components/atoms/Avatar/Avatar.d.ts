import * as React from 'react';
import { type BoxProps } from '../Box';
type NativeImgAttributes = React.ImgHTMLAttributes<HTMLImageElement>;
type Shape = 'circle' | 'square';
export type Props = {
    /** Accessibility text. */
    label: string;
    /** Uses tokens space settings to set the size */
    src?: NativeImgAttributes['src'];
    /** The shape of the avatar. */
    shape?: Shape;
    /** A placeholder for the image to use when not loaded, in css format (e.g. url("https://example.com")) */
    placeholder?: string;
    /** If true sets the component into disabled format. */
    disabled?: boolean;
    /** An element that overlays the avatar */
    checked?: boolean;
    /** An svg to overlay over the avatar */
    icon?: React.ReactElement;
    /** The deconding attribute of an img element */
    decoding?: NativeImgAttributes['decoding'];
    /** A custom sizing for the avatar */
    size?: BoxProps['wh'];
} & Omit<NativeImgAttributes, 'alt' | 'onError' | 'children' | 'onError'>;
export declare const Avatar: {
    ({ label, shape, src, placeholder, decoding, disabled, icon, checked, size, ...props }: Props): React.JSX.Element;
    displayName: string;
};
export {};
