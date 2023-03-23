import { Configuration, OpenAIApi } from "openai";

const generatePrompt = (question: string): string => {
  return `너는 슬랙에서 운영되고 있는 봇이야.
    너는 가능한 한 친절하게 대답해야 해.
    이 질문에 대해 답해봐.
    질문 : ${question}
    답변 : 
    `;
};

export const getChatGptAnswer = async (question: string): Promise<string> => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  const openaiConfig = new Configuration({ apiKey: OPENAI_API_KEY });
  const openaiApi = new OpenAIApi(openaiConfig);

  const prompt = generatePrompt(question);
  const completion = await openaiApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const answer = completion.data.choices[0].message?.content;

  if (answer == null) {
    throw new Error(`OpenAI 서버가 비정상적인 값을 반환했습니다.`);
  }

  return answer;
};
