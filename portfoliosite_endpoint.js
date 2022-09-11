const functions = require('@google-cloud/functions-framework')

// Register an HTTP function with the Functions Framework
functions.http('portfoliosite_endpoint', (req, res) => {

    //set JSON content type and CORS headers for the response
    res.set('Content-Type','application/json')
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    //respond to CORS preflight requests
    if (req.method === 'OPTIONS') {
        // Send an HTTP response
        res.status(204).send('')
    } else {
        // Send an HTTP response
        res.send('OK')
    }

    
    const topicNameOrId = 'projects/portfolio-project-353016/topics/portfoliowebsite'
    const data = JSON.stringify(req.body)
    console.log(`data: ${data}`)
    // Imports the Google Cloud client library
    const {PubSub} = require('@google-cloud/pubsub')

    // Creates a client
    const pubSubClient = new PubSub()

    async function publishMessage(payload) {

        if (payload != '{}') {
            const dataBuffer = Buffer.from(payload)
    // Publishes the message as a string
            try {
                const messageId = await pubSubClient
                .topic(topicNameOrId)
                .publishMessage({data: dataBuffer})
                console.log(`Message ${messageId} published. payload: ${payload}`)
            } catch (error) {
                console.error(`Received error while publishing: ${error.message}`)
                process.exitCode = 1
            }
            
    // Bypass if preflight
        } else {
            console.log(`Empty Payload received, message not published`)
            
        }
    }

    publishMessage(data)

    console.log('function completed')
})
