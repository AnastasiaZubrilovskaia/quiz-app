import { Injectable } from '@angular/core';
import { Test } from '../models/test.model';
import { Attempt } from '../models/attempt.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TESTS_KEY = 'angular-testing-app-tests';
  private readonly ATTEMPTS_KEY = 'angular-testing-app-attempts';

  getTests(): Test[] {
    const testsJson = localStorage.getItem(this.TESTS_KEY);
    return testsJson ? JSON.parse(testsJson) : [];
  }

  saveTest(test: Test): void {
    const tests = this.getTests();
    const existingIndex = tests.findIndex(t => t.id === test.id);
    
    if (existingIndex >= 0) {
      tests[existingIndex] = test;
    } else {
      tests.push(test);
    }
    
    localStorage.setItem(this.TESTS_KEY, JSON.stringify(tests));
  }

  getTestById(id: string): Test | undefined {
    return this.getTests().find(test => test.id === id);
  }

  getAttempts(): Attempt[] {
    const attemptsJson = localStorage.getItem(this.ATTEMPTS_KEY);
    return attemptsJson ? JSON.parse(attemptsJson) : [];
  }

  saveAttempt(attempt: Attempt): void {
    const attempts = this.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
  }

  getAttemptsByTestId(testId: string): Attempt[] {
    return this.getAttempts().filter(attempt => attempt.testId === testId);
  }
}