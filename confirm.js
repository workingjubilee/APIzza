const {withUiHook, htm} = require('@zeit/integration-utils');
const micro = require('micro');

let counter = 0;

// async function confirmPayment(req, res) {
//   // Add CORS support. So, UiHook can be called via client side.
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Authorization, Accept, Content-Type'
//   );

//   if (req.method === 'OPTIONS') {
//     return micro.send(res, 200);
//   }

//   // UiHook works only with HTTP POST.
//   if (req.method !== 'POST') {
//     return micro.send(res, 404, '404 - Not Found');
//   }

//   const payload = await micro.json(req);
//   if (payload.action === 'reset') {
//     counter = 0;
//   } else {
//     counter += 1;
//   }

//   return micro.send(res, 200, `
//     <Page>
//       <P>Counter: ${counter}</P>
//       <Button>Count Me</Button>
//       <Button action="reset">Reset</Button>
//     </Page>
//   `)
// }

// module.exports = confirmPayment;



module.exports = withUiHook(async ({payload, zeitClient}) => {
  const {clientState, action} = payload;
  const store = await zeitClient.getMetadata();

  if (action === 'submit') {
    store.secretId = clientState.secretId;
    store.secretKey = clientState.secretKey;
    await zeitClient.setMetadata(store);
  }

  if (action === 'reset') {
    store.secretId = '';
    store.secretKey = '';
    await zeitClient.setMetadata(store);
  }

  return htm`
    <Page>
      <Container>
        <Input label="Secret Id" name="secretId" value=${store.secretId || ''} />
        <Input label="Secret Key" name="secretKey" value=${store.secretKey || ''} />
      </Container>
      <Container>
        <Button action="submit">Submit</Button>
        <Button action="reset">Reset</Button>
      </Container>
    </Page>
  `
});
