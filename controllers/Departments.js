const Department = require("../models/Department");

const addDepartment = async (req, res) => {
  const { name, manager, totalEmployee, block, roomNumber } = req.body;
  try {
    const newDepartment = new Department({
      name,
      manager,
      totalEmployee,
      block,
      roomNumber,
    });
    await newDepartment.save();
    res.status(200).send({
      success: true,
      newDepartment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server error is occured",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).send({
      success: true,
      departments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal////",
    });
  }
};
module.exports = { addDepartment, getAll };
