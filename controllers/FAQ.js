 const FAQ=require("../models/FAQ")       
 
        const addFAQ=async(req,res)=>{
        const faq = new FAQ({
            question: req.body.question,
            answer: req.body.answer
          });
        
          try {
            const newFAQ = await faq.save();
            res.status(201).json(newFAQ);
          } catch (err) {
            res.status(400).json({ message: err.message });
          }
    }
module.exports=addFAQ