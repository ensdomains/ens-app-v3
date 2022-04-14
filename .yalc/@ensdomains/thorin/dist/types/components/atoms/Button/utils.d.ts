export interface GetCenterProps {
    center: boolean | undefined;
    size: 'small' | 'medium' | 'extraSmall' | undefined;
    side: 'left' | 'right';
}
export declare const getCenterProps: ({ center, size, side }: GetCenterProps) => string | false | undefined;
