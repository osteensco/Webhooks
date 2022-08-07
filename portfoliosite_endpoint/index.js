const functions = require('@google-cloud/functions-framework')

// Register an HTTP function with the Functions Framework
functions.http('endpoint', (req, res) => {

    const topicNameOrId = 'projects/portfolio-project-353016/topics/portfoliowebsite'
    const data = JSON.stringify(req)

    // Imports the Google Cloud client library
    const {PubSub} = require('@google-cloud/pubsub')

    // Creates a client
    const pubSubClient = new PubSub()

    async function publishMessage() {
    // Publishes the message as a string
        const dataBuffer = Buffer.from(data)

        try {
            const messageId = await pubSubClient
            .topic(topicNameOrId)
            .publishMessage({data: dataBuffer})
            console.log(`Message ${messageId} published.`)
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}`)
            process.exitCode = 1
        }
    }

    publishMessage()

    // Send an HTTP response
    res.send('OK')
})

