import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

export const handler = async(event) => {
    
    // import
    const dynamoDBClient = new DynamoDBClient({ region: 'ap-northeast-2' })
    const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient)

    // email check letter
    const checkLetter = {
        TableName: 'userData',
        Key: {
            'email': event.email.toLowerCase()
        }
    }

    // letter send
    const result = await dynamoDBDocumentClient.send(new GetCommand(checkLetter)) 

    return result;
}
