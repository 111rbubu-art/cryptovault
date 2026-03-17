exports.handler = async function(event) {
  const ENV_KEY = process.env.ZERION_API_KEY || '';
  const CLI_KEY = event.queryStringParameters?.apikey || '';
  const API_KEY = CLI_KEY || ENV_KEY;
  const BASE_URL = 'https://api.zerion.io/v1';
  const path = event.queryStringParameters?.path || '';
  if (!path) return { statusCode:400, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body:JSON.stringify({error:'path required'}) };
  if (!API_KEY) return { statusCode:401, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body:JSON.stringify({error:'Zerion APIキーが設定されていません。'}) };
  const url = `${BASE_URL}/${path}`;
  const headers = { 'Accept':'application/json', 'Authorization':'Basic '+Buffer.from(API_KEY+':').toString('base64') };
  const opts = { method:'GET', headers };
  if (event.httpMethod==='POST'&&event.body) { opts.method='POST'; opts.body=event.body; headers['Content-Type']='application/json'; }
  try {
    const resp = await fetch(url, opts);
    const data = await resp.json();
    return { statusCode:resp.status, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body:JSON.stringify(data) };
  } catch(e) {
    return { statusCode:500, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body:JSON.stringify({error:e.message}) };
  }
};
