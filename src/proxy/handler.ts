import {
  type APIGatewayEvent,
  type APIGatewayProxyCallback,
  type APIGatewayProxyResult,
  type Context,
} from "aws-lambda";
import { App, AwsLambdaReceiver } from "@slack/bolt";
import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

app.event(`app_mention`, async ({ event }) => {
  console.log(`Received Event : ${JSON.stringify(event)}`);
  const lambdaClient = new LambdaClient({});
  const payload = {
    channel: event.channel,
    // ts : 해당 글의 ID.
    // 쓰레드 ID가 있는 경우는 해당 쓰레드에 대답을 달고, 없는 경우 해당 글의 ID로 쓰레드를 시작한다.
    thread_ts: event.thread_ts ?? event.ts,
    // <@DFJKVDUF> 안녕~~ 과 같은 형태에서 뒤의 대화만 추출
    question: event.text.split("<@")[1].split(">")[1].trim(),
  };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: `chatgpt-serverless-slack-bot-${process.env.STAGE}-openai-response`,
      InvocationType: InvocationType.Event,
      Payload: Buffer.from(JSON.stringify(payload)),
    })
  );
});

export const handle = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<APIGatewayProxyResult> => {
  const handler = await awsLambdaReceiver.start();
  return await handler(event, context, callback);
};
