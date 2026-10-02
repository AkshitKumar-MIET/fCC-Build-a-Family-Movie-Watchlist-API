export function authorizeModification(req, res, next) {
  const { role, id } = req.user;
  const isOwnWatchlist = String(id) === req.params.userId;

  if (role !== "parent" && !(role === "child" && isOwnWatchlist)) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}
