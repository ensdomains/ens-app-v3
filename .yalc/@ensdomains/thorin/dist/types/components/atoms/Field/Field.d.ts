import * as React from 'react';
import { Space } from '../../../tokens';
import { ReactNodeNoStrings } from '../../../types';
import { useFieldIds } from '../../../hooks';
export type State = ReturnType<typeof useFieldIds> | undefined;
type NativeFormProps = React.AllHTMLAttributes<HTMLFormElement>;
type NativeLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
export type FieldBaseProps = {
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
    /** Have lavel appear on the left of the form element. */
    reverse?: boolean;
    /** If true, will set the Fields component to read only mode */
    readOnly?: boolean;
};
type Props = FieldBaseProps & {
    children: React.ReactElement | ((context: State) => ReactNodeNoStrings);
    /** The id attribute of the label element */
    id?: NativeFormProps['id'];
    disabled?: boolean;
} & Omit<NativeLabelProps, 'id' | 'children'>;
export declare const Field: {
    ({ children, description, error, hideLabel, id, label, labelSecondary, required, inline, readOnly, width, reverse, disabled, ...props }: Props): JSX.Element;
    displayName: string;
};
export {};
