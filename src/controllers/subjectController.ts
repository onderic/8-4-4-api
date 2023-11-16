import { Request, Response } from 'express';
import { Subject } from '../models/subject';
import { Class } from '../models/class';
import { Staff } from '../models/staff';


export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, code, isCompulsory, classId } = req.body;

    if (!name || !code || isCompulsory === undefined || classId === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const selectedClass = await Class.findByPk(classId);

    if (!selectedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if the combination of name and code is unique within the class
    const existingSubject = await Subject.findOne({
      where: { classId, name, code },
    });

    if (existingSubject) {
      return res.status(400).json({ error: 'Subject name and code must be unique within the class' });
    }

    // Create the new subject
    const newSubject = await Subject.create({ name, code, isCompulsory, classId });

    res.status(201).json({ message: 'Subject created successfully', newSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllSubjects = async (req:Request, res:Response): Promise<void> =>{
  try{
    const subjects = await Subject.findAll({
      attributes: ['id', 'name', 'code','isCompulsory'],
      include: [
        {
          model: Class,
          attributes: ['name', 'abbreviation'],
          include: [
              {
                model: Staff,
                attributes: ['id', 'name', 'type'],
              },
            ],
        },
      ]
    });
  
    res.status(200).json(subjects);
  }catch(error){
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, isCompulsory } = req.body;

    if (!name || !code || !isCompulsory) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Update the subject
    await subject.update({ name, code, isCompulsory });

    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Delete the subject
    await subject.destroy();

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
