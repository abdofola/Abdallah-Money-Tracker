import { withSessionRoute } from "@lib/session";

export default withSessionRoute((req, _res) => {
  req.session.destroy();
});
