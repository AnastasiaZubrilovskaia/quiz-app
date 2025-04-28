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
    if (!title?.trim()) {
      throw new Error('Test title is required');
    }

    const newTest: Test = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim() || '',
      questions: [],
      createdAt: new Date()
    };
    
    this.storageService.saveTest(newTest);
    return newTest;
  }

  getTestById(id: string): Test | undefined {
    if (!id) {
      throw new Error('Test ID is required');
    }
    return this.storageService.getTestById(id);
  }

  getTests(): Test[] {
    return this.storageService.getTests();
  }

  getAttemptsByTestId(testId: string): Attempt[] {
    const attempts = this.storageService.getAttempts();
    return attempts.filter(attempt => attempt.testId === testId);
  }

  saveTest(test: Test): void {
    if (!test?.id) {
      throw new Error('Invalid test: ID is required');
    }
    this.storageService.saveTest(test);
  }

  saveTestWithCurrentQuestion(testId: string, currentQuestion: Partial<Question>): void {
    if (!testId) {
      throw new Error('Test ID is required');
    }

    const test = this.getTestById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // If there's an unsaved question
    if (currentQuestion.text?.trim() && currentQuestion.options?.some(o => o.trim())) {
      const question: Question = {
        id: uuidv4(),
        text: currentQuestion.text.trim(),
        options: (currentQuestion.options || ['', '']).map(o => o.trim()),
        correctAnswer: currentQuestion.correctAnswer || 0,
        points: currentQuestion.points || 1
      };
      test.questions = [...test.questions, question];
    }

    this.storageService.saveTest(test);
  }

  finalizeTestSave(test: Test): void {
    if (!test?.id) {
      throw new Error('Invalid test: ID is required');
    }

    // Create a deep copy of the test
    const testCopy = JSON.parse(JSON.stringify(test));
    
    // Ensure all questions have IDs
    testCopy.questions = testCopy.questions.map((q: Question) => ({
      ...q,
      id: q.id || uuidv4(),
      text: q.text.trim(),
      options: q.options.map(o => o.trim())
    }));
  
    this.storageService.saveTest(testCopy);
  }

  addQuestionToTest(testId: string, question: Omit<Question, 'id'>): void {
    if (!testId) {
      throw new Error('Test ID is required');
    }

    const test = this.storageService.getTestById(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    
    const newQuestion: Question = {
      id: uuidv4(),
      text: question.text.trim(),
      options: question.options.map(o => o.trim()),
      correctAnswer: question.correctAnswer,
      points: question.points || 1
    };
    
    test.questions = [...test.questions, newQuestion];
    this.storageService.saveTest(test);
  }

  evaluateTest(testId: string, studentName: string, answers: number[]): Attempt {
    if (!testId) {
      throw new Error('Test ID is required');
    }
    if (!studentName?.trim()) {
      throw new Error('Student name is required');
    }
    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    const test = this.storageService.getTestById(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    
    let score = 0;
    
    test.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += question.points;
      }
    });
    
    const attempt: Attempt = {
      id: uuidv4(),
      testId,
      studentName: studentName.trim(),
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

  deleteTest(testId: string): void {
    this.storageService.deleteTest(testId);
  }
}