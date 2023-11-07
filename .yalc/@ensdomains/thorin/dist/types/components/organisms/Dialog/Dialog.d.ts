import * as React from 'react';
import { WithAlert } from '../../../types';
import { BoxProps } from '../../atoms/Box/Box';
export type StepType = 'notStarted' | 'inProgress' | 'completed';
type TitleProps = {
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
} & WithAlert;
type StepProps = {
    currentStep?: number;
    stepCount?: number;
    stepStatus?: StepType;
};
type BaseProps = {
    variant?: 'closable' | 'actionable' | 'blank';
    children: React.ReactNode;
    onDismiss?: () => void;
    onClose?: () => void;
    open: boolean;
};
type ClosableProps = {
    variant: 'closable';
} & TitleProps;
type ActionableProps = {
    variant: 'actionable';
    trailing?: React.ReactNode;
    leading?: React.ReactNode;
    center?: boolean;
} & TitleProps & StepProps;
type BlankProps = {
    variant: 'blank';
};
type Props = BaseProps & (ClosableProps | ActionableProps | BlankProps);
export declare const Dialog: {
    ({ children, onDismiss, onClose, open, variant, ...props }: Props): React.JSX.Element;
    displayName: string;
    Footer: ({ leading, trailing, currentStep, stepCount, stepStatus, }: {
        leading?: React.ReactNode;
        trailing: React.ReactNode;
    } & StepProps) => React.JSX.Element | null;
    Heading: ({ title, subtitle, alert, }: TitleProps & StepProps & WithAlert) => React.JSX.Element;
    Content: ({ children }: {
        children?: React.ReactNode;
    }) => React.JSX.Element;
    CloseButton: (props: BoxProps) => React.JSX.Element;
};
export {};
