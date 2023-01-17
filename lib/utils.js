export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatNumber(n) {
    return n > 9 ? n : '0' + n
}

export function getDateDiff(odate) {

    let today = new Date()

    let diff = today - odate
    let delta = diff / 1000

    if(delta < 60) {

        
        return delta < 5 ? 'Just Now' : `${Math.floor(delta)} secs ago`

    } else {

        delta = diff / (1000 * 60)

        if(delta < 60) {

            delta = Math.floor(delta)
            return delta > 1 ? `${delta} mins ago` : `${delta} min ago`
            
        } else  {

            delta = diff / (1000 * 60 * 60)

            if(delta < 24) {

                delta = Math.floor(delta)
                return delta > 1 ? `${delta} hours ago` : `${delta} hour ago`
                
            } else {

                delta = diff / (1000 * 60 * 60 * 24)

                if(delta < 31) {

                    if(delta < 2) {

                        const sdate1 = getYesterday(today)
                        const sdate2 = getMonthDate(odate)

                        let _delta = Math.round(delta)

                        if(delta < 2 && (sdate1.length > 0 && sdate2.length > 0)) {
                            _delta = sdate1 === sdate2 ? 1 : _delta
                        }

                        return _delta > 1 ? `${_delta} days ago` : `Yesterday`

                    } else {

                        delta = Math.round(delta)
                        return `${delta} days ago`

                    }
                    
                }
                
            }

        }

    }

    return ''

}

export function formatDateTime(sdate) {
    const odate = new Date(sdate)
    const syear = odate.getFullYear()
    let smonth = odate.getMonth() + 1
    let sday = odate.getDate()
    smonth = formatNumber(smonth)
    sday = formatNumber(sday)
    let shour = odate.getHours()
    let smins = odate.getMinutes()
    shour = formatNumber(shour)
    smins = formatNumber(smins)
    const sdiff = getDateDiff(odate)
    return [[syear, smonth, sday].join('-'), [shour, smins].join(':'),sdiff].join(' ')
}