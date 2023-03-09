const router = require ("express").Router();
const employee = require("../Models/Employee");

//ADD EMPLOYEE
router.post("/Create",async(req,res)=>{
    const Employee = new employee(req.body);
    try{
        const saveduser = await Employee.save();
        res.status(200).json(saveduser);
    }catch(err){
         res.status(500).json(err);
    }
})

//GET ALL EMPLOYEEs
router.get("/",async(req,res)=>{
    try{
        const users = await employee.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})

//GET SPEC EMPLOYEE
router.get("/:id",async(req,res)=>{
    try{
        const User = await employee.findById(req.params.id);
        res.status(200).json(User);
    }catch(err){
        res.status(500).json(err);
    }
})

//UPDATE EMPLOYEE
router.put("/:id",async(req,res)=>{
    try{
        const disuser = await employee.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
            )
        res.status(200).json(disuser);
    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE EMPLOYEE
router.delete("/:id",async(req,res)=>{
    try{
        const deleteduser = await employee.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete Success !");
    }catch(err){
        res.status(500).json(err);
    }
})









module.exports = router;