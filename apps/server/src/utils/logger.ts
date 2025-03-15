import pino from 'pino';

const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
            },
            {
                target: 'pino-pretty',
                options: {
                    destination: './prettyLogs.json',
                    colorize: false,
                }
            }, {
                target: 'pino/file',
                options: {
                    destination: './logs.json'
                }
            }]
    },
    level: process.env.LOG_LEVEL || 'info',
})

export default logger;