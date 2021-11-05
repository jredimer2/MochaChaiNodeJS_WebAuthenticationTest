import express, { NextFunction } from 'express';
import base64 from 'base-64';
import utf8 from 'utf8';
import { VALID_USERS } from './userLogins';

const app = express()
const port = 3000


class Error401 extends Error {
  status: number;
  message: string;
  constructor(message: string) {
    super(message);
    this.status = 401;
    this.message = message;
  }
}

app.use(express.json())

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });

//
// Description: I authenticate username and passowrd using base64. 
// If it matches the header authorization key, then I call the next() middleware. 
// Otherwise, I call next(Error401), forcing the errorMiddleware() to be called and return status 401.
//
const basicAuthHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  // implementation here
  let userId = 1;  // select VALID_USER to test
  let { userLogin, password } = VALID_USERS.users[userId];
  
  let auth : string = req.headers.authorization || '';
  var authArr = auth.split(' ');

  try {
    var regExp = new RegExp('^Basic ');
    if (!regExp.test(auth))
      return next(new Error401('Missing Basic prefix'));

    var decodedBase64 = base64.decode(authArr[1]); // throws exception if invalid authArr[1] value 
    var credArr = decodedBase64.split(':');

    if (credArr.length > 2)
      return next(new Error401('Username/password connot contain :'));

    if (credArr[0] == '')
      return next(new Error401('Missing username'));

    if (credArr[1] == '')
      return next(new Error401('Missing password'));

    if (credArr[0] != userLogin || credArr[1] != password)
      return next(new Error401('Invalid userLogin or password'));

  } catch (error) {
    return next(new Error401('Invalid key'));
  }

  // authentication succesful, pass request onto next middleware
  next()

}

app.get('/basic-auth', basicAuthHandler, (req: express.Request, res: express.Response) => {
  res.status(200).end();
})

app.use(function errorMiddleware(err: Error401, req: express.Request, res: express.Response, next: NextFunction) {
  if (err instanceof Error401)
    res.status(err.status).send(err.message);
})

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})