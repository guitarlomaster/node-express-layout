export interface IValidator {
    [p: string]: IValidatorItem
}

export interface IValidatorItem {
    email?: boolean;
    required?: boolean;
    min_length?: number;
    max_length?: number;
}
