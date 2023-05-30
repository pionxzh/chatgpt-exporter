# 기여하기

이 프로젝트에 기여하고자 하는 당신을 환영합니다! 기여를 제출하기 전에 다음 안내 사항을 읽어주시기 바랍니다.

## Setup

이 프로젝트는 패키지 관리를 위해 [PNPM](https://pnpm.js.org/)을 사용합니다. 진행하기 전에 PNPM이 설치되어 있는지 확인해주세요.

1. 저장소를 포크하고 master 브랜치에서 자신의 브랜치를 생성합니다.
2. 저장소 루트에서 pnpm install 명령을 실행합니다.
3. 개발 서버를 시작하려면 pnpm dev를 실행합니다.
4. 팝업에서 "Install"을 클릭하여 개발 스크립트를 설치합니다.
5. 변경 사항을 작성하세요!

##린팅과 타입 체크
이 프로젝트는 [ESLint](https://eslint.org/) 와 [TypeScript](https://www.typescriptlang.org/) 를 사용하여 코드의 린팅과 타입 체크를 각각 수행합니다. PR을 제출하기 전에 코드가 린팅과 타입 체크를 모두 통과하는지 확인해주세요.


```bash
pnpm run lint
pnpm run test
```

## 커밋 메시지 형식

이 프로젝트는 일관된 [커밋 메시지 형식](https://www.conventionalcommits.org/)을 사용합니다. 커밋 메시지가 올바른 형식으로 작성되었는지 확인해주세요.

**커밋 메시지나 PR 설명에 이슈 번호를 언급해주세요**
