import { defineAuth } from '@aws-amplify/backend';


export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcom to the travel generator!',
      verificationEmailBody: (createCode)=>
        `Your verification code is: ${createCode()}`,
    },
  },
});
