const { withUiHook } = require("@zeit/integration-utils");
const axios = require("axios");

module.exports = withUiHook(async options => {
  const { payload, zeitClient } = options;
  const { action, clientState } = payload;
  let metadata = await zeitClient.getMetadata();

  switch (action) {
    case "submit":
      metadata = clientState;
      await zeitClient.setMetadata(metadata);
    case "reset":
      metadata = {};
      await zeitClient.setMetadata(metadata);
    case "test":
      metadata.secretId = "test";
      axios.get("https://a-p-izza.herokuapp.com/").then(test => {
        console.log(test);
        return `<H2>${test.body.message}</H2>`;
      });
    default:
      null;
  }

  return `
        <Page>
            <Container>
                <Input label="Secret Id" name="secretId" value="${metadata.secretId ||
                  ""}"/>
                <Input label="Secret Key" name="secretKey" type="password" value="${metadata.secretKey ||
                  ""}" />
            </Container>
            <Container>
                <Button action="submit">Submit</Button>
                <Button action="reset">Reset</Button>
                <Button action="test">Test</Button>
            </Container>
        </Page>
    `;
});
