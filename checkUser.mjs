import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'

export const handler = async (event) => {

    // import
    const dynamoDBClient = new DynamoDBClient({ region: 'ap-northeast-2' })

    const checkLetter = {
        TableName: 'userData',
        IndexName: 'userName-index',
        KeyConditionExpression: 'userName = :user',
        ExpressionAttributeValues: {
            ':user': {
                S: event.userName
            }
        }
    }

    const checkResult = await dynamoDBClient.send(new QueryCommand(checkLetter))
    let response = checkResult.Count == 0 ? 0 : 1;
    
    return response
}
