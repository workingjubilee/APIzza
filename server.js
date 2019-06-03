// const { withUiHook } = require("@zeit/integration-utils");
// "dominos": "workingjubilee/require-dominos#master"

const axios = require("axios");

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

module.exports = uiHook;

// Everything after here only matters when running npm start
const server = micro(uiHook);
const port = process.env.PORT || 5005;

console.log(`UiHook started on http://localhost:${port}`);

server.listen(port, err => {
  if (err) {
    throw err;
  }
});

