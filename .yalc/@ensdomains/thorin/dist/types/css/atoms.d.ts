import * as resetStyles from './reset.css';
import { Sprinkles } from './sprinkles.css';
export declare type Atoms = Sprinkles & {
    reset?: resetStyles.Element & keyof JSX.IntrinsicElements;
};
export declare const atoms: ({ reset, ...rest }: Atoms) => string;
