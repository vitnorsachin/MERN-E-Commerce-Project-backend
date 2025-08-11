import passport from "passport"

export function isAuth(req, res, done) {
  return passport.authenticate('jwt')
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
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODkyMGQ5NjU5ZTZjNzAxODkzNTBlNmYiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NDc0NjU4Nn0.E9FT6EWmcEL_JCq9wdu-IJctq7FaB_-RGHkoaTXY7bg"
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODkyMGRiZjU5ZTZjNzAxODkzNTBlNzIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NDkyNzI3Mn0.W7-T_HHjUL3ebpFCuCT65XuYLjcHfFDsAurpZwsFtMU"
  return token;
}