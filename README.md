# ts_dynamodb_example

This project contains source code and supporting files for a serverless application with DynamoDB integration that you can deploy with the SAM CLI. It includes the following files and folders:

- handlers - Code for the application's Lambda function written in TypeScript
- events - Invocation events that you can use to invoke the function
- template.yaml - A template that defines the application's AWS resources including the DynamoDB table

The application uses several AWS resources, including Lambda functions, an API Gateway API, and a DynamoDB table. These resources are defined in the template.yaml file in this project.

## Clone the project from github
```bash
git clone git@github.com:fantasy-lotus/ts_dynamodb_example.git
```
## Deploy the application

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. Use a name with hyphens instead of underscores.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review.
* **Allow SAM CLI IAM role creation**: This example creates an IAM role required for the Lambda function to access the DynamoDB table.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project.

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
ts_dynamodb_example$ sam build
```

The SAM CLI installs dependencies defined in package.json, compiles TypeScript, creates a deployment package, and saves it in the build folder.

~~Test a single function by invoking it directly with a test event:~~

```bash
ts_dynamodb_example$ sam local invoke HelloWorldFunction --event events/event.json
```

**The SAM CLI can also emulate your application's API:**

```bash
ts_dynamodb_example$ sam local start-api
ts_dynamodb_example$ curl -X POST http://localhost:3000/hello -H "Content-Type: application/json" -d '{}'
```

## Local DynamoDB Setup

To use DynamoDB locally with your application:

```bash
# Run DynamoDB container
docker run -p 8000:8000 amazon/dynamodb-local

# Create the UsersTable
aws dynamodb create-table \
  --table-name UsersTable \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000

# List tables
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Query table contents
aws dynamodb scan --table-name UsersTable --endpoint-url http://localhost:8000
```

## Debugging Tips

1. When running in Docker containers, use `host.docker.internal` to connect to services on your host machine:

   ```typescript
   const client = DynamoDBDocumentClient.from(new DynamoDBClient({
     endpoint: 'http://host.docker.internal:8000',
     region: 'us-east-1'
   }));
   ```

2. Enable debugging with:

   ```bash
   sam local start-api --debug
   ```

3. To skip pulling Docker images if you have connectivity issues:

   ```bash
   sam local start-api --skip-pull-image
   ```

4. Make sure your DynamoDB tables exist before testing with the Lambda function