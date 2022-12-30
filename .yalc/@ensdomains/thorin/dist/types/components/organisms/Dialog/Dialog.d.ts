import * as React from 'react';
import { WithAlert } from '@/src/types';
declare type StepType = 'notStarted' | 'inProgress' | 'completed';
declare type TitleProps = {
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
} & WithAlert;
declare type StepProps = {
    currentStep?: number;
    stepCount?: number;
    stepStatus?: StepType;
};
declare type BaseProps = {
    variant?: 'closable' | 'actionable' | 'blank';
    children: React.ReactNode;
    onDismiss?: () => void;
    open: boolean;
};
declare type ClosableProps = {
    variant: 'closable';
} & TitleProps;
declare type ActionableProps = {
    variant: 'actionable';
    trailing?: React.ReactNode;
    leading?: React.ReactNode;
    center?: boolean;
} & TitleProps & StepProps;
declare type BlankProps = {
    variant: 'blank';
};
declare type Props = BaseProps & (ClosableProps | ActionableProps | BlankProps);
export declare const Dialog: {
    ({ children, onDismiss, open, variant, ...props }: Props): JSX.Element;
    displayName: string;
    Footer: ({ leading, trailing, center, currentStep, stepCount, stepStatus, }: {
        leading?: React.ReactNode;
        trailing: React.ReactNode;
        center?: boolean | undefined;
    } & StepProps) => JSX.Element | null;
    Heading: ({ title, subtitle, alert, }: TitleProps & StepProps & WithAlert) => JSX.Element;
    CloseButton: ({ onClick }: {
        onClick: () => void;
    }) => JSX.Element;
};
export {};
