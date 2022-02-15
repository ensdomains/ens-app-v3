import * as React from 'react';
import { AllOrNone } from '../../types';
export declare type OptionalTitle = AllOrNone<{
    title: string;
    titleId: string;
}>;
export declare type IconProps = React.SVGProps<SVGSVGElement> & OptionalTitle;
