
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
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
        if (exdays != 0) {
            let exp = "expires=" + exdays
            document.cookie = field + "=" + value + ";" + exp
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
                continue
            }
        }
        return ""
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



///////////////////Webhook///////////////////////

class Webhook {
    constructor (data, endpoint){
        this.payload = data
        this.build(endpoint)
        this.send(data, "/webhooks/")
    }

    build (endpoint) {
        this.payload.webhook = endpoint
    }

    send (data, endpointURL) {
        const request = new XMLHttpRequest()
        request.open("POST", endpointURL)
  
        request.setRequestHeader('Content-type', 'application/json')

        const csrftoken = getCookie('csrftoken');

        request.setRequestHeader('X-CSRFToken', csrftoken);
    
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    console.log('Data forwarded successfully');
                } else {
                    console.error('Error forwarding data:', request.status);
                }
            }
        };
    
        request.send(JSON.stringify(data));

    }
}




///////////////script/////////////////

let id = new Cookie('id')
let session = new Cookie('sessionID')


let discord = new Webhook(
    {
        username: "Scott's Portfolio Site Traffic",
        content: `______

    ${id.value} 
    ${session.value}    
        Visited: ${document.location.href}
        ${id.datetime}

    ______`
    },
    "discord_endpoint"
)

let gcp = new Webhook(
    {
        TimeStamp: [id.datetime],
        ID: [id.value],
        Session: [session.value],
        Page: [document.location.href],
        Referrer: [document.referrer],
        Device: [navigator.userAgent],
        Language: [navigator.language]
    },
    "gcp_endpoint"
)
