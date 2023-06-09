# chatgpt-serverless-slack-bot

<p align="center">
  <img src="https://user-images.githubusercontent.com/31124212/227202602-9513c19c-60d5-404f-b4b4-22494fb76fc1.png" width="300" height="300">
  <br>
  <strong>서버 유지 비용 없는 커스텀 ChatGPT Slack Bot 템플릿</strong>
  <br>
  <br>
</p>

### AWS Lambda와 OpenAI API를 이용한 Serverless ChatGPT 봇 생성 템플릿입니다.

- **서버 유지관리 비용 (거의)없음** : Serverless 아키텍쳐를 이용해 AWS Lambda에 봇을 호스팅합니다. 한 달 동안 100만건의 요청이 무료입니다! 
- **간단한 프롬프트 수정** : 프롬프트를 간단히 수정하여 ChatGPT를 커스터마이징 할 수 있습니다. 친구를 따라하는 봇을 만들어보세요!
- **고가용성** : 서버가 다운되거나 하는 걸 걱정할 필요가 없습니다!
- **배포 및 수정** : 한번 설정해 두었다면, `serverless deploy` 명령 한 번으로 코드를 수정하고 변경할 수 있습니다!

### 설정 방법

**0. 이 리포지토리를 Fork 또는 Clone하고, .env.example 파일을 .env로 이름을 바꿔 주세요.**

**1. Slack 봇 생성**

- https://api.slack.com/apps 에 접속하여 Create New Bots -> From scratch 를 누릅니다.
  - App Name 및 초대할 Workspace를 설정해 주세요.
- 이후, 해당 봇을 선택한 후 App Home -> Your App’s Presence in Slack 섹션을 수정합니다.
  - 적당한 Display Name, 적당한 Default Name 을 넣어주고 Always Show My Bot as Online를 눌러 줍니다.
- 이후, `Basic Information` 탭 하단 `Display Information` 에서 닉네임, 앱 아이콘, Description을 설정합니다.
- 이후 적절한 권한을 설정합니다.
  - `OAuth & Permissions` 탭에 들어간 후, `Bot Token Scopes` 섹션을 찾습니다.
  - 아래 권한을 추가해 주세요.
    - app_mentions:read
    - channels:join
    - chat:write
  - 권한 추가 후 OAuth Tokens for Your Workspace 를 눌러 스페이스에 설치합니다.
  - 이 때 나오는 `xoxb-` 로 시작하는 토큰을 `.env` 파일의 `SLACK_BOT_TOKEN` 부분에 붙여넣어 주세요.
  - 그리고 이후 `Basic Information` 탭의 `Signing Secret` 을 show ->  복사 이후 `.env` 파일의 SLACK_SIGNING_SECRET 부분에 붙여넣어 주세요.
 

**2. OpenAI API Token 발급**

- https://platform.openai.com/ 에 접속하여 가입 후, `Settings > Manage Account > Billing` 에서 카드를 등록해 주세요.
- 이후 `API Keys > +Create New secret key` 를 눌러 API 키를 생성 후, .env 파일의 `OPENAI_API_KEY` 부분에 붙여넣어 주세요.

**3. Node.js 설치 및 Serverless Framework 설정**

- https://nodejs.org/en/download/ 에 들어가서 Node.js를 다운 후 설치해 주세요.
- 이후 커맨드라인에서 `npm install -g serverless` 를 입력하여 Serverless Framework를 설치해 주세요. ([관련 문서](https://www.serverless.com/framework/docs/getting-started))

**4. AWS 접속 권한 설정**

- AWS에 가입하지 않았다면, AWS에 가입해 주세요. https://console.aws.amazon.com/console/home
- 콘솔에 로그인 후, `IAM -> 사용자 -> 사용자 추가` 를 눌러 새 사용자를 등록해 주세요.
  - 사용자 이름에 적절한 이름을 적어 주세요. 저는 `serverless-framework-deploy` 로 설정했습니다.
  - 이후 권한 설정에서 `직접 정책 연결 -> AdministratorAccess` 를 추가한 후, 다음 버튼을 눌러주세요.
  - 이후 사용자 생성 버튼을 누르면 새로운 사용자가 생성됩니다.
- 이후, `사용자` 방금 탭에서 방금 생성한 유저를 클릭합니다.
- 이후 `보안 자격 증명` 탭에서 `액세스 키 만들기` 를 클릭합니다.
  - `Command Line Interface(CLI)` 를 선택한 후, `위의 권장 사항을 이해했으며 액세스 키 생성을 계속하려고 합니다.` 를 체크 후 `다음`을 클릭합니다.
  - 설명 태그 값에 적당한 이름을 적습니다. 저는 `access key for serverless deploy` 라고 적었습니다.
- ⚠️이후 생성된 키로 Serverless Framework를 설정합니다. 이 때, Key가 유출되지 않도록 조심해 주세요!! 이 키가 유출되면, 누구나 내 AWS 계정을 사용할 수 있습니다!!⚠️
  - 파일에 저장해 두지 말고, 한번 설정한 이후 창을 닫아버리는 것을 추천합니다. 
- 다시 커맨드라인으로 돌아가서, `serverless config credentials --provider aws --key <액세스 키> --secret <비밀 액세스 키>` 를 설정합니다.
  - 이런 모양입니다 : `serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**5. 서버 배포**

- 커맨드라인에서 다음 커맨드를 실행하여, 관련 플러그인을 설치합니다.
  - `serverless plugin install -n serverless-plugin-typescript`
  - `serverless plugin install -n serverless-dotenv-plugin`
- 이후 서버를 배포합니다! `serverless deploy` 커맨드를 입력해 주세요.
- 이후 서버가 AWS에 올라가고, 잠깐 기다리면 `Endpoint : ANY - https://jkjadf823.execute-api.ap-northeast-1.amazonaws.com/` 와 같은 글이 뜹니다.
- 이 URL을 복사해 주세요.

**6. Slack Bot 이벤트 등록**

- https://api.slack.com/apps 에 다시 접속하여, `Event Subscription` 탭을 눌러 주세요.
- Enable Events를 눌러 이벤트를 활성화하고, Request URL에 5.에서 복사한 URL을 입력해 주세요.
- 이후 `Subscribe to bot events` 에서 다음 이벤트를 추가해 주세요.
  - app_mention
  
**7. 완료**

- 설정이 완료되었습니다! 이제 `@봇-이름` 을 통해 ChatGPT 봇에게 말을 걸어 보세요!
