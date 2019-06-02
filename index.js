// const { withUiHook } = require("@zeit/integration-utils");
// const axios = require("axios");

// const store = {
//   secretId: "",
//   secretKey: ""
// };

// module.exports = withUiHook(async options => {
//   const { payload, zeitClient } = options;
//   const { action, clientState } = payload;
//   // let res = await zeitClient.fetchAndThrow();

//   // switch (action) {
//   //   case "submit":
//   //     metadata = clientState;
//   //     await zeitClient.setMetadata(metadata);
//   //   case "reset":
//   //     metadata = {};
//   //     await zeitClient.setMetadata(metadata);
//   //   case "test":
//   //     metadata.secretId = "test";
//   //     axios.get("https://a-p-izza.herokuapp.com/").then(test => {
//   //       console.log(test);
//   //       return `<H2>${test.body.message}</H2>`;
//   //     });
//   //   default:
//   //     null;
//   // }

//   if (action === "reset") {
//     store.secretId = "";
//     store.secretKey = "";
//   } else if (action === "test") {
//     store.secretId = "test";
//     axios.get("https://a-p-izza.herokuapp.com/").then(() => `<H2>'works</H2>`);
//   }

//   return `
//         <Page>
//             <Container>
//                 <Input label="Secret Id" name="secretId" value="${store.secretId ||
//                   ""}"/>
//                 <Input label="Secret Key" name="secretKey" type="password" value="${store.secretKey ||
//                   ""}" />
//             </Container>
//             <Container>
//                 <Button action="submit">Submit</Button>
//                 <Button action="reset">Reset</Button>
//                 <Button action="test">Test</Button>
//             </Container>
//         </Page>
//     `;
// });

const micro = require("micro");

const store = {
  secretId: "",
  secretKey: ""
};

async function uiHook(req, res) {
  // Add CORS support. So, UiHook can be called via client side.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Accept, Content-Type"
  );

  if (req.method === "OPTIONS") {
    return micro.send(res, 200);
  }

  // UiHook works only with HTTP POST.
  if (req.method !== "POST") {
    return micro.send(res, 404, "404 - Not Found");
  }

  const payload = await micro.json(req);

  if (payload.action === "reset") {
    store.secretId = "";
    store.secretKey = "";
  } else if (payload.action === "test") {
    store.secretId = "test";
    axios.get("https://a-p-izza.herokuapp.com/").then(() => `<H2>'works</H2>`);
  }

  // if (payload.action === "reset") {
  //   counter = 0;
  // } else {
  //   counter += 1;
  // }

  return micro.send(
    res,
    200,
    `
        <Page>
            <Container>
                <Input label="Secret Id" name="secretId" value="${store.secretId ||
                  ""}"/>
                <Input label="Secret Key" name="secretKey" type="password" value="${store.secretKey ||
                  ""}" />
            </Container>
            <Container>
                <Button action="submit">Submit</Button>
                <Button action="reset">Reset</Button>
                <Button action="test">Test</Button>
            </Container>
        </Page>
    `
  );
}

const server = micro(uiHook);
const port = process.env.PORT || 3000;

console.log(`UiHook started on http://localhost:${port}`);
server.listen(port, err => {
  if (err) {
    throw err;
  }
});
