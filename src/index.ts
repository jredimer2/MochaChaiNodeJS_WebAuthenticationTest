import express from 'express';
const app = express()
const port = 3000
var base64 = require('base-64');
var utf8 = require('utf8');

app.use(express.json())

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });

const basicAuthHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // implementation here
  console.log('testpoint 1');
  console.log(req.headers.authorization);

  let username = 'matt@gmail.com';
  let password = 'this is a v@lid password!';

  var text = username + ':' + password;
  var bytes = utf8.encode(text);
  var encoded = 'Basic ' + base64.encode(bytes);

  console.log('encoded =', 'Basic ' + encoded);



  //let auth : string [] = req.headers.authorization?.split(' ');
  
  // authentication succesful, pass request onto next middleware
  console.log(`[${req.headers.authorization}]`);
  console.log(`[${encoded}]`);

  if (encoded == req.headers.authorization) 
    console.log('Authenticated');
  else 
    console.log('Not authenticated');

  var decodedData = base64.decode("");

  console.log(decodedData);
  next()
}

app.get('/basic-auth', basicAuthHandler, (req: express.Request, res: express.Response) => {
  res.status(200).end();
})

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})