import { Injectable } from '@angular/core';
import { Test } from '../models/test.model';
import { Attempt } from '../models/attempt.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TESTS_KEY = 'angular-testing-app-tests';
  private readonly ATTEMPTS_KEY = 'angular-testing-app-attempts';

  private serializeDate(obj: any): any {
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Date) {
        return { _type: 'date', value: value.toISOString() };
      }
      return value;
    });
  }

  private deserializeDate(obj: any): any {
    return JSON.parse(obj, (key, value) => {
      if (value && value._type === 'date') {
        return new Date(value.value);
      }
      return value;
    });
  }

  getTests(): Test[] {
    const testsJson = localStorage.getItem(this.TESTS_KEY);
    return testsJson ? this.deserializeDate(testsJson) : [];
  }

  saveTest(test: Test): void {
    try {
      const tests = this.getTests();
      const index = tests.findIndex(t => t.id === test.id);
      
      if (index >= 0) {
        tests[index] = test;
      } else {
        tests.push(test);
      }
      
      localStorage.setItem(this.TESTS_KEY, this.serializeDate(tests));
      console.log('Saved to localStorage:', test);
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  getTestById(id: string): Test | undefined {
    return this.getTests().find(test => test.id === id);
  }

  getAttempts(): Attempt[] {
    const attemptsJson = localStorage.getItem(this.ATTEMPTS_KEY);
    return attemptsJson ? this.deserializeDate(attemptsJson) : [];
  }

  saveAttempt(attempt: Attempt): void {
    const attempts = this.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(this.ATTEMPTS_KEY, this.serializeDate(attempts));
  }

  getAttemptsByTestId(testId: string): Attempt[] {
    return this.getAttempts().filter(attempt => attempt.testId === testId);
  }
}