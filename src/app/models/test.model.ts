import { Question } from "./question.model";

export interface Test {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    createdAt: Date;
  }