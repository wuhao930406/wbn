function bodyParse(vals) {
    let val = JSON.parse(JSON.stringify(vals))
    let res = ''
    for (let key in val) {
        let mostkey = key, value = val[key] ? val[key] : ''
        res += `&${mostkey}=${value}`;
    }
    return "?" + res.substr(1)
}


export default bodyParse