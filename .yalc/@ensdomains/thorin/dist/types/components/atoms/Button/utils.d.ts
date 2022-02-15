import { BoxProps } from '../Box';
import { Size } from './styles.css';
export declare const getCenterProps: (center: boolean | undefined, size: Size, side: 'left' | 'right') => Pick<BoxProps, 'position'>;
