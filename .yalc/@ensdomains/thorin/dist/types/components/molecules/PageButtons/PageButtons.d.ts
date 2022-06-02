declare type Props = {
    total: number;
    current: number;
    max?: number;
    alwaysShowFirst?: boolean;
    alwaysShowLast?: boolean;
    onChange: (value: number) => void;
};
export declare const PageButtons: ({ total, current, max, alwaysShowFirst, alwaysShowLast, onChange, }: Props) => JSX.Element;
export {};
