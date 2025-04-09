import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({
    endpoint: 'http://host.docker.internal:8000', // 本地 DynamoDB
    region: 'us-east-1', // 随便填，但要一致
  })
);

export const lambdaHandler = async (event: APIGatewayEvent, context: Context) => {
  const userId = "user-122";
  const item = {
    userId,
    name: "小鹦鹉 🦜",
    createdAt: new Date().toISOString()
  };
  console.log("写入数据:");
  try {
    //使用client创建表
    // await client.send(new CreateTableCommand({
    //   TableName: "UsersTable",
    //   KeySchema: [
    //     { AttributeName: "userId", KeyType: "HASH" }
    //   ],
    //   AttributeDefinitions: [
    //     { AttributeName: "userId", AttributeType: "S" }
    //   ],
    //   BillingMode: "PAY_PER_REQUEST"
    // }));
    // console.log("创建表成功");

    await client.send(new PutCommand({
      TableName: "UsersTable",
      Item: item
    }));

    const result = await client.send(new GetCommand({
      TableName: "UsersTable",
      Key: { userId }
    }));
    console.log("读取数据:", result.Item);
    if (!result.Item) {
        console.error("没有找到数据");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "成功写入并读取数据 🎉",
        data: result.Item
      })
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong 🦜' }),
    };
  }
};
