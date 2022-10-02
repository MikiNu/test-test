const baseUrl = 'https://eoj3r7f3r4ef6v4.m.pipedream.net'

export const sendCalcData = (data) => {
    return fetch(`${baseUrl}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        method: 'POST'
    })
}
