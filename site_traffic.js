
/////////////////cookies///////////////////
let types = [
    ['id', 3650],
    ['sessionID', 0],

]

function setExpiration(type) {
    for (i = 0; i < types.length; i++) {
        if (types[i][0] == type) {
            return types[i][1]
        }
    }

}

class Cookie {
    constructor (type) {
        this.type = type
        this.datetime = new Date()
        this.expires = this.expiration(type)
        this.value = this.read(type)

    }

    generateID() {
        let elem = [
            this.datetime.getUTCDate(),
            this.datetime.getUTCMonth(),
            this.datetime.getUTCFullYear(),
            this.datetime.getTime(),
            `${Math.random()*100 + Math.random()*100 }`,
        ]
        return `${this.type}${elem[0]}${elem[1]}${elem[2]}${elem[3]}${elem[4]}`
    }

    expiration(type) {
        let days = setExpiration(type)
        if (days > 0) {
            const d = new Date()
            d.setTime(d.getTime() + (days*24*60*60*1000))
            return d.toUTCString()
        } else {
            return false
        }
        
    }

    set(field,value,exdays) {
        if (exdays) {
            let exp = "expires=" + exdays
            document.cookie = field + "=" + value + ";" + exp + ";path=/"
        } else {//cookie should expire on browser close if not listed
            document.cookie = field + "=" + value
        }

    }
  
    get(field) {
        let name = field + "="
        let decodedCookie = decodeURIComponent(document.cookie)
        let ca = decodedCookie.split(';')
        for (i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            } else {
                return ""
            }
        }
    }
    
    read(type) {
        let i = this.get(type)
        if (i == "") {
            i = this.generateID()
            this.set(type, i, this.expires)
        }
        return i
    }








}


let id = Cookie('id')
let session = Cookie('sessionID')

console.log('Success')