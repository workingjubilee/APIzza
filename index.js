

// const { withUiHook, htm } = require("@zeit/integration-utils");
// // const fetch = require('@zeit/fetch')(require('node-fetch'));
// const axios = require("axios");
// const fetch = require("@zeit/fetch")(require("node-fetch"));
// // const PizzaForm = id => htm`
// //         <Container>
// //             <Input/>
// //         </Container>
// // `;

// module.exports = withUiHook(async ({ payload, zeitClient }) => {
//   const { clientState, action } = payload;
//   const store = await zeitClient.getMetadata();

//   if (action === "test") {
//     // const res = await axios.get("https://a-p-izza.herokuapp.com");
//     await fetch("https://api.zeit.co/v2/oauth/access_token", {
//       method: "GET"
//       // headers: {
//       //   "Content-Type": "application/x-www-form-urlencoded"
//       // },
//       // body: qs.stringify({
//       //   client_id: CLIENT_ID,
//       //   client_secret: CLIENT_SECRET,
//       //   code: query.code,
//       //   redirect_uri: REDIRECT_URL
//       // })
//     });

//     console.log("makes it here");
//     console.log(res);
//     // store.secretId = clientState.secretId;
//     // store.secretKey = clientState.secretKey;
//     // await zeitClient.setMetadata(store);
//   }

//   //   if (action === "reset") {
//   //     store.secretId = "";
//   //     store.secretKey = "";
//   //     await zeitClient.setMetadata(store);
//   //   }

//   return htm`
//     <Page>
//         <Container>
//             <Button action="test">test</Button>
//             <Button>another button</Button>
//         </Container>
// 		</Page>
//     `;
// });
// //     <Container>
// //         <H1>hungry?</H1>
// //         <Input label="Secret Id" name="secretId" value=${store.secretId || ""} />
// //         <Input label="Secret Key" name="secretKey" type="password" value=${store.secretKey ||
// //   ""} />
// //     </Container>
