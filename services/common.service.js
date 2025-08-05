import passport from "passport"

export function isAuth(req, res, done) {
  return passport.authenticate('jwt')
}

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role }
}