// // const { withUiHook } = require("@zeit/integration-utils");
// // "dominos": "workingjubilee/require-dominos#master"
// const {withUiHook, htm, ZeitClient} = require('@zeit/integration-utils');

// const axios = require("axios");

// const micro = require("micro");

// const store = {
//   secretId: "",
//   secretKey: ""
// };

// async function uiHook(req, res) {
//   // Add CORS support. So, UiHook can be called via client side.
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Authorization, Accept, Content-Type"
//   );

//   if (req.method === "OPTIONS") {
//     return micro.send(res, 200);
//   }

//   // UiHook works only with HTTP POST.
//   if (req.method !== "POST") {
//     return micro.send(res, 404, "404 - Not Found");
//   }

//   const payload = await micro.json(req);

//   if (payload.action === "reset") {
//     store.secretId = "";
//     store.secretKey = "";
//   } else if (payload.action === "test") {
//     store.secretId = "test";
//     axios.get("https://a-p-izza.herokuapp.com/").then(() => `<H2>'works</H2>`);
//   }

//   return micro.send(
//     res,
//     200,
//     `
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
//     `
//   );
// }

// const server = micro(uiHook);
// const port = process.env.PORT || 3000;

// console.log(`UiHook started on http://localhost:${port}`);
// server.listen(port, err => {
//   if (err) {
//     throw err;
//   }
// });

// // module.exports = server;

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
const TokenStore = {};
const EventsStore = {};

const renderUIHook = withUiHook(({payload}) => {
	const {user, team, configurationId} = payload;
	const ownerId = team? team.id : user.id;
	const scope = team? team.slug : user.username;
	const events = EventsStore[ownerId] || [];

	return htm`
		<Page>
			<H1>Events for this Account</H1>
			<P>Deploy something with the following command to recieve events:</P>
			<Code>${`now --scope=${scope}`}</Code>
			<BR/>
			${events.map(e => htm`
				<Box margin="20px 0">
					<Code>${JSON.stringify(e)}</Code>
				</Box>
			`)}
			<AutoRefresh timeout=${5000} />
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
