import { Router } from "express";
import { addConnection, addMessage, getConnections, getMessages } from "../lib/auth.js";

export const socialRouter = Router();
function token(req) { return req.headers.authorization?.replace("Bearer ", ""); }

socialRouter.get("/connections", (req, res) => res.json({ connections: getConnections(token(req)) }));
socialRouter.post("/connections", (req, res) => {
  try { res.status(201).json({ connection: addConnection(token(req), req.body.profileId, req.body.note) }); }
  catch (error) { res.status(401).json({ error: error.message }); }
});
socialRouter.get("/messages/:profileId", (req, res) => res.json({ messages: getMessages(token(req), req.params.profileId) }));
socialRouter.post("/messages", (req, res) => {
  try { res.status(201).json({ message: addMessage(token(req), req.body.profileId, req.body.text) }); }
  catch (error) { res.status(401).json({ error: error.message }); }
});