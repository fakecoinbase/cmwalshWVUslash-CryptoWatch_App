export default class Holding {
    public ticker: string
    public amount: number
    public currentPrice?: any

    constructor(ticker: string, amount: number, currentPrice?: any) {
        this.ticker = ticker
        this.amount = amount
        this.currentPrice = currentPrice
    }
}