import distanceInWords from "date-fns/distance_in_words"
export const filters =  {
    filters: {
        mul1000: (value) => {
            return value * 1000
        },
        distanceInWords: (value) => {
            return distanceInWords(Date.now(), value, {addSuffix:true})
        },
        date: (value) => {
            let date = new Date(value)
            return date.toLocaleString()
        },
        hashrate: (hashrate) => {
            if(!hashrate) hashrate = 0
            const byteUnits = [" H/s", " kH/s", " MH/s", " GH/s", " TH/s", " PH/s"]
            let i = 0
            if(hashrate > 0) {
                while(hashrate > 1000) {
                    hashrate /= 1000
                    i++
                }
            }
            return parseFloat(hashrate).toFixed(2) + byteUnits[i]
        },
        percentage: (val) => {
            return Math.round(val * 100) + "%"
        },
        commas: (num) => {
            return num.toLocaleString()
        },
        time: (val) => {
            if(val == null) {
                return "Never"
            }
            return distanceInWords(0, val)
        }
    },
}
