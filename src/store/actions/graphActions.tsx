export function updateGraphData(data:any, ticker:string) {
    return {
        type: 'UPDATE_GRAPH',
        data: data,
        ticker: ticker
    }
}