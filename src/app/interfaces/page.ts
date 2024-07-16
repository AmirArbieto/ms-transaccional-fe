export interface Page<T> {
    content: Array<T>;
    totalPages: number;
    totalElements: number;
    size: number;
    last: boolean;
    first: boolean;
}