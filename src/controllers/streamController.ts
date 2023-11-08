import { Request, Response } from "express";
import { Stream } from "../models/stream";
import { Class } from "../models/class";
import { Staff } from "../models/staff";

export const createStream = async (req: Request, res: Response) => {
  try {
    const { name, abbreviation, teacher, classId } = req.body;

    // Check if the teacher and classId exist
    const [checkDetails, foundClass] = await Promise.all([
      Staff.findByPk(teacher),
      Class.findByPk(classId),
    ]);

    if (!checkDetails || !foundClass) {
      return res.status(400).json({ error: "Invalid teacher or classId." });
    }

    // Create a new stream
    const newStream = await Stream.create({
      name,
      abbreviation,
      teacher,
      classId,
    } as Stream );

    res.status(201).json({ message: "Stream created successfully", newStream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a stream' });
  }
}


export const getStreams = async (req: Request, res: Response) => {
    try {
      const streams = await Stream.findAll({
        include: [
          {
            model: Staff,
            as: 'staff', 
          },
          {
            model: Class,
            as: 'class',
          },
        ],
      });
  
      res.status(200).json(streams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve streams' });
    }
  }



export const updateStream = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Extract the stream ID from the URL
      const { name, abbreviation, teacher, classId } = req.body;
  
      // Check if the teacher and classId exist
      const [checkDetails, foundClass] = await Promise.all([
        Staff.findByPk(teacher),
        Class.findByPk(classId),
      ]);
  
      if (!checkDetails || !foundClass) {
        return res.status(400).json({ error: "Invalid teacher or classId." });
      }
  
      // Find the stream by its ID
      const existingStream = await Stream.findByPk(id);
  
      if (!existingStream) {
        return res.status(404).json({ error: "Stream not found." });
      }
  
      console.log("Before update: ", existingStream.toJSON());

      // Update the stream's attributes
      existingStream.name = name;
      existingStream.abbreviation = abbreviation;
      existingStream.teacher = teacher;
      existingStream.classId = classId;
      
      console.log("After update: ", existingStream.toJSON());
      
      await existingStream.save();
  
      res.status(200).json({ message: "Stream updated successfully", updatedStream: existingStream });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the stream' });
    }
  }

  export const deleteStream = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Find the stream by its ID
      const existingStream = await Stream.findByPk(id);
  
      if (!existingStream) {
        return res.status(404).json({ error: "Stream not found." });
      }
  
      // Delete the stream
      await existingStream.destroy();
  
      res.status(200).json({ message: "Stream deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the stream' });
    }
}
  