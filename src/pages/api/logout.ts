import { withSessionRoute } from "@lib/session";

export default withSessionRoute((req, res) => {
  req.session.destroy();

  res.status(200).json({message:`the session was destroyed successfully!`})
});
