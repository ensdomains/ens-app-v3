import * as React from 'react';
import { RadioButton } from '..';
declare type Props = {
    children: React.ReactElement<typeof RadioButton>[] | React.ReactElement<typeof RadioButton>;
    currentValue?: any;
    onChange?: (value: any) => void;
};
export declare const RadioButtonGroup: ({ children, currentValue: _currentValue, onChange, }: Props) => JSX.Element;
export {};
