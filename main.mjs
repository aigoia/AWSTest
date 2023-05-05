import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'
import crypto from "crypto"

export const handler = async(event) => {
    
    // import
    const dynamoDBClient = new DynamoDBClient({ region: 'ap-northeast-2' })
    const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient)
    const lambdaClient = new LambdaClient({ region: 'ap-northeast-2' })

    // default status code and body
    let responseStatusCode = 400
    let responseBody = JSON.stringify('Default')

    // check email exist
    const userInputPayload = {
        FunctionName: 'checkEmailUserData',
        Payload: JSON.stringify(event)
    }

    const emailCheckResult = await lambdaClient.send(new InvokeCommand(userInputPayload))
    const emailCheckResultJson = JSON.parse(String.fromCharCode.apply(null, emailCheckResult.Payload))
    const emailItem = emailCheckResultJson["Item"];

    if (emailItem == null)
    {
        console.log("Email dose not exist");
    }
    else
    {
        console.log("Email already exist");
        
        const existEmailResponse = {
            StatusCode: 201,
            Body: "Email already exist"
        }
        return existEmailResponse;
    }

    // user input
    const createUserInput = {
        TableName: 'userData',
        Item: {
            'email': event.email.toLowerCase(),
            'userName': event.userName.toLowerCase(),
            'password': event.password
        }
    }

    try {
        responseStatusCode = 200
        responseBody = await dynamoDBDocumentClient.send(new PutCommand(createUserInput))
    } catch (error) {
        responseStatusCode = 400
        responseBody = error
    }

    const response = {
        StatusCode: responseStatusCode,
        Body: responseBody
    }
    return response
}