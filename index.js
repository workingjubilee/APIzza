const micro = require("micro");
const { withUiHook, htm, ZeitClient } = require("@zeit/integration-utils");

const {
  CLIENT_ID,
  CLIENT_SECRET,
  ROOT_URL,
  REDIRECT_URL
} = require("./constants.js");

const store = {
  secretId: "",
  secretKey: ""
};

const renderUIHook = withUiHook(async ({ payload }) => {
  const { user, team, configurationId } = payload;
  const ownerId = team ? team.id : user.id;
  const scope = team ? team.slug : user.username;
  const events = EventsStore[ownerId] || [];
  const store = await zeitClient.getMetadata();

  if (payload.action === "reset") {
    store.addressLine1 = "";
    store.addressLine2 = "";
    store.city = "";
    store.state = "";
    store.zip = "";
    await zeitClient.setMetadata(store);
  } else if (payload.action === "test") {
    store.secretId = "test";
    axios.get("https://a-p-izza.herokuapp.com/").then(() => `<H2>'works</H2>`);
  }

  return htm`
		<Page>
			<Container>
				<Input label="Address Line 1" name="addressLine1" value=${store.addressLine1 ||
          ""} />
				<Input label="Address Line 2" name="addressLine2" value=${store.addressLine2 ||
          ""} />
				<Input label="City" name="city" value=${store.city || ""} />
				<Input label="State" name="state" type="password" value=${store.state || ""} />
				<Input label="Zip" name="zip" value=${store.zip || ""} />
			</Container>
			<Container>
				<Button action="test">Test</Button>
				<Button action="reset">Reset</Button>
			</Container>
		</Page>
	`;
});

module.exports = function(req, res) {
  return renderUIHook(req, res);
};
