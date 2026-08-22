import { Router } from "express";
import { addConnection, addMessage, getConnections, getMessages } from "../lib/auth.js";

export const socialRouter = Router();
function token(req) { return req.headers.authorization?.replace("Bearer ", ""); }

socialRouter.get("/connections", async (req, res) => {
  try { res.json({ connections: await getConnections(token(req)) }); }
  catch (error) { res.status(503).json({ error: error.message }); }
});
socialRouter.post("/connections", async (req, res) => {
  try { res.status(201).json({ connection: await addConnection(token(req), req.body.profileId, req.body.note) }); }
  catch (error) { res.status(401).json({ error: error.message }); }
});
socialRouter.get("/messages/:profileId", async (req, res) => {
  try { res.json({ messages: await getMessages(token(req), req.params.profileId) }); }
  catch (error) { res.status(503).json({ error: error.message }); }
});
socialRouter.post("/messages", async (req, res) => {
  try { res.status(201).json({ message: await addMessage(token(req), req.body.profileId, req.body.text) }); }
  catch (error) { res.status(401).json({ error: error.message }); }
});