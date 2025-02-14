export interface Token {
    currency: string;
    date: string;
    price: number;
}

export interface FormData {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
}