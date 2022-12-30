declare type Args = {
    description?: boolean;
    error?: boolean;
    id?: string;
};
export declare const useFieldIds: ({ description, error, id, }?: Args) => {
    content: {
        'aria-describedby': string | undefined;
        'aria-labelledby': string;
        id: string;
    };
    description: {
        id: string;
    } | undefined;
    error: {
        id: string;
    } | undefined;
    label: {
        htmlFor: string;
        id: string;
    };
};
export {};
