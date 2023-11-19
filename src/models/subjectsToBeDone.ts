// models/subjectsToBeDone.ts
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import { Subject } from "./subject";
import { Exam } from "./exam";
import { Class } from "./class";

interface ExamSubjectAttributes {
  examId: number;
  subjectId: number;
  classId: number;
  maxScore: number;
}

@Table({
  tableName: "subjectsToBeDone"
})
@Index({
  unique: true,
  fields: ['examId', 'subjectId', 'classId'],
} as any)
export class SubjectsToBeDone extends Model<ExamSubjectAttributes> {
  @ForeignKey(() => Exam)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  examId!: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subjectId!: number;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  classId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxScore!: number;

  @BelongsTo(() => Exam, 'examId')
  exam!: Exam;

  @BelongsTo(() => Subject, 'subjectId')
  subject!: Subject;

  @BelongsTo(() => Class, 'classId')
  class!: Class;
}
