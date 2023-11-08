const config = {
  // server: 'https://api.play.elonmars.io',
  server: process.env.REACT_APP_API_URL,
  websiteURL: "http://95.216.80.180",
  // websiteURL: process.env.REACT_APP_WEBSITE_URL,
  port: process.env.REACT_APP_API_PORT,
  baseURL: '/api/v1',
  appID: 'elonmars-game',
  agentUID: 'elonmars',
}


export default config
