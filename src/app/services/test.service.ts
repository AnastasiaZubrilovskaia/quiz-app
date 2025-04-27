import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Test} from '../models/test.model';
import { Question } from '../models/question.model';
import { Attempt } from '../models/attempt.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private storageService: StorageService) {}

  createTest(title: string, description: string): Test {
    const newTest: Test = {
      id: uuidv4(),
      title,
      description,
      questions: [],
      createdAt: new Date()
    };
    
    this.storageService.saveTest(newTest);
    return newTest;
  }
  getTestById(id: string): Test | undefined {
    return this.storageService.getTestById(id);
  }
  getAttemptsByTestId(testId: string): Attempt[] {
    return this.storageService.getAttemptsByTestId(testId);
  }
  saveTest(test: Test): void {
    this.storageService.saveTest(test);
  }

  addQuestionToTest(testId: string, question: Omit<Question, 'id'>): void {
    const test = this.storageService.getTestById(testId);
    if (!test) throw new Error('Test not found');
    
    const newQuestion: Question = {
      id: uuidv4(),
      ...question
    };
    
    test.questions.push(newQuestion);
    this.storageService.saveTest(test);
  }

  evaluateTest(testId: string, studentName: string, answers: number[]): Attempt {
    const test = this.storageService.getTestById(testId);
    if (!test) throw new Error('Test not found');
    
    let score = 0;
    
    test.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += question.points;
      }
    });
    
    const attempt: Attempt = {
      id: uuidv4(),
      testId,
      studentName,
      answers,
      score,
      date: new Date()
    };
    
    this.storageService.saveAttempt(attempt);
    return attempt;
  }

  getAttempts(): Attempt[] {
    return this.storageService.getAttempts();
  }
}