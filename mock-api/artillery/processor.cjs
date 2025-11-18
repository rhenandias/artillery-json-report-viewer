module.exports = {
  randomString,
  randomNumber,
  logRequest,
};

function randomString(userContext, events, done) {
  const length = 8;
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  userContext.vars.randomString = result;
  return done();
}

function randomNumber(userContext, events, done) {
  const min = 1;
  const max = 1000;
  
  userContext.vars.randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return done();
}

function logRequest(requestParams, response, context, ee, next) {
  console.log(`Request to: ${requestParams.url}`);
  console.log(`Status: ${response.statusCode}`);
  return next();
}
