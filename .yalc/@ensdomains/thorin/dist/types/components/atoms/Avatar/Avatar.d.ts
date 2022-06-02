declare type Shape = 'circle' | 'square';
export declare type Props = {
    /** Accessibility text. */
    label: string;
    /** If true, removes the border around the avatar. */
    noBorder?: boolean;
    /** Uses tokens space settings to set the size */
    src?: string;
    /** The shape of the avatar. */
    shape?: Shape;
};
export declare const Avatar: {
    ({ label, noBorder, shape, src, }: Props): JSX.Element;
    displayName: string;
};
export {};
