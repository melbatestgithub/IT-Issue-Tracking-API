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

    const getFaq=async(req,res)=>{
      try {
        const faqs=await FAQ.find()
        res.status(200).send(faqs)
      } catch (error) {
        res.status(500).send(error)
      }
    }
module.exports={addFAQ,getFaq}