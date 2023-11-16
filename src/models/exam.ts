import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import { Class } from "./class";
import { SubjectsUnderTheExam } from "./subjectsUnderTheExam";


interface ExamAttributes {
    name: string;
    startDate: Date;
    endDate: Date;
    classId: number;
  }

@Table({
    timestamps: true,
    tableName: "exams",
})

export class  Exam extends Model<ExamAttributes> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      name!: string;
    
      @Column({
        type: DataType.DATE,
        allowNull: false,
      })
      startDate!: Date;
    
      @Column({
        type: DataType.DATE,
        allowNull: false,
      })
      endDate!: Date;
    
      @ForeignKey(() => Class)
      @Column({
        type: DataType.INTEGER,
        allowNull: false,
      })
      classId!: number;
    
      @BelongsTo(() => Class, 'classId')
      class!: Class;
    
      @HasMany(() => SubjectsUnderTheExam)
      subjectsUnderTheExams!: SubjectsUnderTheExam[];
}