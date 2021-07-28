const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Apollo Server Authentication

module.exports = {
  signToken: function({ username, email, _id }) {
    // create a token with the username, email, and id, signed with the secret
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function({ req }) {
    // token may be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // if by headers, remove "Bearer" from "<tokenvalue>" value and return just the token value
    if (req.headers.authorization) {
        token = token
            .split(' ')
            .pop()
            .trim();
    }
    // if there is no token, return the request object as sent
    if (!token) {
        return req;
    }
    // otherwise...
    try {
        // decode and attach user data to the request object
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
    } catch {
        console.log('Invalid token');
    }
    // return the updated request object
    return req;
  }
};







// RESTful API form
// module.exports = {
//   // function for our authenticated routes
//   authMiddleware: function (req, res, next) {
//     // allows token to be sent via  req.query or headers
//     let token = req.query.token || req.headers.authorization;

//     // ["Bearer", "<tokenvalue>"]
//     if (req.headers.authorization) {
//       token = token.split(' ').pop().trim();
//     }

//     if (!token) {
//       return res.status(400).json({ message: 'You have no token!' });
//     }

//     // verify token and get user data out of it
//     try {
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//     } catch {
//       console.log('Invalid token');
//       return res.status(400).json({ message: 'invalid token!' });
//     }

//     // send to next endpoint
//     next();
//   },
//   signToken: function ({ username, email, _id }) {
//     const payload = { username, email, _id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };