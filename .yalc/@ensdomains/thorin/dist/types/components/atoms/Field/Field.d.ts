import * as React from 'react';
import { ReactNodeNoStrings } from '../../../types';
import { useFieldIds } from '../../../hooks';
import { Space } from '@/src/tokens';
declare type State = ReturnType<typeof useFieldIds> | undefined;
declare type NativeFormProps = React.AllHTMLAttributes<HTMLFormElement>;
declare type NativeLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
declare type Placement = 'top' | 'bottom';
export declare type FieldBaseProps = {
    /** Description text or react component. */
    description?: React.ReactNode;
    /** Error text or a react component. */
    error?: React.ReactNode;
    /** If true, hides the label and secondary label. */
    hideLabel?: boolean;
    /** Label text or react component */
    label: React.ReactNode;
    /** Secondary text or react component */
    labelSecondary?: React.ReactNode;
    /** Adds mark to label */
    required?: NativeFormProps['required'];
    /** If true, moves the label and status messages to the right of the content. */
    inline?: boolean;
    /** A tokens space key value setting the width of the parent element. */
    width?: Space;
    /** Set the placement of the error and description. Does not affect inline mode. */
    labelPlacement?: Placement | {
        error?: Placement;
        description?: Placement;
    };
};
declare type Props = FieldBaseProps & {
    children: React.ReactElement | ((context: State) => ReactNodeNoStrings);
    /** The id attribute of the label element */
    id?: NativeFormProps['id'];
} & Omit<NativeLabelProps, 'id' | 'children'>;
export declare const Field: {
    ({ children, description, error, hideLabel, id, label, labelSecondary, required, inline, width, labelPlacement, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
