import passport from "passport"

// export function isAuth(req, res, done) {
//   return passport.authenticate('jwt')
// }
export function isAuth() {
  return passport.authenticate("jwt", { session: false });
}


export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role }
}

export const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  // TODO : this is temporary token for testing without cookie
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODkyMGRiZjU5ZTZjNzAxODkzNTBlNzIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NTM1NjgxOX0.11gq3vbbYxJ7KOZs-PIJsN9oNc_RI9GvTATaPyOpnv8";
  return token;
}