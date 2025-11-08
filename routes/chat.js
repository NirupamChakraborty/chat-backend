import express from 'express';

import Thread from '../models/Thread.model.js';
import { getOpenAiResponse } from '../utils/openai.js';
const router = express.Router();

// test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: 'xyz',
            title: 'Test Thread',
        });
        const response = await thread.save();
        res.send(response);
        
    } catch (error) {
        console.log(error)
    }
});

// get all threads
router.get("/thread",async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 }); // descending order -> means recent
        res.json(threads);
    } catch (error) {
        res.json(error)
    }
});


// get paryicular thread by threadId
router.get("/thread/:threadId",  async (req, res) => {
    try {
       
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId });
        if(!thread){
            res.status(404).json({ message: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (error) {
        res.json(error)
    }
});


// delete thread by threadId
router.delete("/thread/:threadId",   async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if(!deletedThread){
            return res.status(404).json({ message: "Thread not found" });
        }
        res.json({ message: "Thread deleted successfully" });
    } catch (error) {
        res.json(error)
    }
});


// post/ chat // imp

router.post("/chat", async (req, res) => {
    
    const { threadId, messages } = req.body;
    if(!threadId || !messages){
        return res.status(400).json({ message: "threadId and messages are required" });
    }
    try {
       let thread = await Thread.findOne({threadId});
       if(!thread){
        // create a new thread in the database
        thread = new Thread({
            threadId,
            title: messages,
            messages: [{
                role: 'user',
                content: messages,
            }]
        });
       }else{
        thread.messages.push({
            role: 'user',
            content: messages,
        })
       }

       const assistantReply = await getOpenAiResponse(messages);
         thread.messages.push({
          role: 'assistant',
          content: assistantReply,
         });
         thread.updatedAt = new Date();
         await thread.save();

         res.json({reply:assistantReply});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
});


export default router;