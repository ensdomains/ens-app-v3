import * as React from 'react';
import { RadioButton } from '..';
declare type Props = {
    children: React.ReactElement<typeof RadioButton>[] | React.ReactElement<typeof RadioButton>;
    /** The current value of the selected radio button. */
    currentValue?: any;
    /** The handler for the change event. */
    onChange?: (value: any) => void;
};
export declare const RadioButtonGroup: {
    ({ children, currentValue: _currentValue, onChange, }: Props): JSX.Element;
    displayName: string;
};
export {};
