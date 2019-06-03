const micro = require('micro');
// const fetch = require('@zeit/fetch')(require('node-fetch'));
const {withUiHook, htm, ZeitClient} = require('@zeit/integration-utils');
// const {parse: parseUrl} = require('url');
// const qs = require('querystring');
const {
	CLIENT_ID,
	CLIENT_SECRET,
	ROOT_URL,
	REDIRECT_URL
} = require('./constants.js');

// Use a real database for these stores for production

const store = {
  secretId: "",
  secretKey: ""
};

const renderUIHook = withUiHook(({payload}) => {
	const {user, team, configurationId} = payload;
	const ownerId = team? team.id : user.id;
	const scope = team? team.slug : user.username;
	const events = EventsStore[ownerId] || [];

	if (payload.action === "reset") {
		store.secretId = "";
		store.secretKey = "";
	} else if (payload.action === "test") {
		store.secretId = "test";
		axios.get("https://a-p-izza.herokuapp.com/").then(() => `<H2>'works</H2>`);
	}

	return htm`
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
});

// async function setupWebhook(req, res) {
// 	const {query} = parseUrl(req.url, true);
// 	const tokenRes = await fetch('https://api.zeit.co/v2/oauth/access_token', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/x-www-form-urlencoded'
// 		},
// 		body: qs.stringify({
// 			client_id: CLIENT_ID,
// 			client_secret: CLIENT_SECRET,
// 			code: query.code,
// 			redirect_uri: REDIRECT_URL
// 		})
// 	});

// 	const tokenPayload = await tokenRes.json();
// 	const token = tokenPayload['access_token'];
// 	TokenStore[query.configurationId] = token;

// 	const zeitClient = new ZeitClient({token, teamId: query.teamId});
// 	const hookInfo = await zeitClient.fetchAndThrow(`/v1/integrations/webhooks`, {
// 		method: 'POST',
// 		data: {
// 			name: 'default',
// 			url: `${ROOT_URL}/webhook`
// 		}
// 	});

// 	res.writeHead(302, {
// 		'Location': query.next
// 	});
// 	res.end('Redirecting..');
// }

// async function handleEvents(req, res) {
// 	const event = await micro.json(req);
// 	console.log('RECEIVE EVENT', event);
// 	const ownerId = event.teamId || event.userId;

// 	EventsStore[ownerId] = EventsStore[ownerId] || [];
// 	EventsStore[ownerId].unshift(event);
// 	EventsStore[ownerId] = EventsStore[ownerId].slice(0, 50);

// 	return micro.send(res, 200, {});
// }

module.exports = function(req, res) {
	// if (req.method === 'GET') {
	// 	return setupWebhook(req, res);
	// }

	// if (req.url === '/webhook') {
	// 	return handleEvents(req, res);
	// }

	return renderUIHook(req, res);
}
