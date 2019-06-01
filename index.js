const { withUiHook, htm } = require("@zeit/integration-utils");

// const PizzaForm = id => htm`
//         <Container>
//             <Input/>
//         </Container>
// `;

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { clientState, action } = payload;
  const store = await zeitClient.getMetadata();

  if (action === "submit") {
    axios.get("https://a-p-izza.herokuapp.com/");
    // store.secretId = clientState.secretId;
    // store.secretKey = clientState.secretKey;
    // await zeitClient.setMetadata(store);
  }

  //   if (action === "reset") {
  //     store.secretId = "";
  //     store.secretKey = "";
  //     await zeitClient.setMetadata(store);
  //   }

  return htm`
		<Page>
        <Container>
        <Button action="test">Submit</Button>
        </Container>
		</Page>
        `;
});
//     <Container>
//         <H1>hungry?</H1>
//         <Input label="Secret Id" name="secretId" value=${store.secretId || ""} />
//         <Input label="Secret Key" name="secretKey" type="password" value=${store.secretKey ||
//   ""} />
//     </Container>
