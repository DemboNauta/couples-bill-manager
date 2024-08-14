export interface Expense
{
    id: number,
    userId: number,
    category: string,
    amount: number,
    description: string,
    date: Date,
    transactionType: string

}