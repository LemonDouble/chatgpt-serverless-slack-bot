import { WebClient } from "@slack/web-api";
import { getChatGptAnswer } from "./openai";

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

interface OpenAIQuestionRequest {
  channel: string;
  thread_ts: string;
  question: string;
}

export const handle = async (event: OpenAIQuestionRequest): Promise<void> => {
  console.log(`Received Event : ${JSON.stringify(event)}`);

  const answer = await getChatGptAnswer(event.question);

  await webClient.chat.postMessage({
    channel: event.channel,
    thread_ts: event.thread_ts,
    text: answer,
  });
};
