import { withSessionRoute } from "@lib/session";

export default withSessionRoute((req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
