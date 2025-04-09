import { APIGatewayEvent, Context } from "aws-lambda";//lambda
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";//ddb client
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";//document
import { Table, Entity, item } from "dynamodb-toolbox";//dynamodb-toolbox
import { table } from "console";

const client = new DynamoDBClient({
    endpoint: 'http://host.docker.internal:8000', // 本地 DynamoDB
    region: 'us-east-1', // 随便填，但要一致
});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;
const UsersTable = new Table({//toolbox table init
    documentClient: docClient,
    name: tableName,
    partitionKey: {name: "pk",type: "string"},
    sortKey: {name: "sk",type: "number"}
    // 这里可以添加其他配置选项
    // 比如索引、全局二级索引等
});

