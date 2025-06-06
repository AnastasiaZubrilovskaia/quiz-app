import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { Test } from '../../../models/test.model';
import { Question } from '../../../models/question.model';
import { Attempt } from '../../../models/attempt.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-taker',
  templateUrl: './test-taker.component.html',
  styleUrls: ['./test-taker.component.css'],
  standalone: true, //компонент независимый (не нужны доп модули)
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule
  ]
})
export class TestTakerComponent implements OnInit {
  testId: string = '';
  studentName: string = '';
  test: Test | null = null;
  currentQuestionIndex: number = -1; // Текущий вопрос (-1 - тест не начат)
  answers: number[] = []; // Массив ответов студента
  testCompleted: boolean = false;
  result: Attempt | null = null; // Результат прохождения
  testStarted: boolean = false; // Начат ли тест (флаг)
  showReview: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private snackBar: MatSnackBar //для отображения уведомлений в снэк-баре
  ) {}

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id') || '';
    this.loadTest();
  }

  loadTest(): void {
    this.test = this.testService.getTestById(this.testId) || null;
    if (this.test) {
      this.answers = new Array(this.test.questions.length).fill(-1);
    }
  }

  startTest(): void {
    if (!this.studentName.trim()) {
      this.snackBar.open('Введите свое имя', 'Закрыть', { duration: 3000 });
      return;
    }
    this.testStarted = true; 
    this.currentQuestionIndex = 0; 
  }

  selectAnswer(optionIndex: number): void {
    this.answers[this.currentQuestionIndex] = optionIndex;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < (this.test?.questions.length || 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitTest(): void {
    if (this.answers.some(a => a === -1)) {
      this.snackBar.open('Пожалуйста, ответьте на все вопросы', 'Закрыть', { duration: 3000 });
      return;
    }
    
    if (this.test && this.studentName) {
      this.result = this.testService.evaluateTest(this.test.id, this.studentName, this.answers);
      this.testCompleted = true;
    }
  }

  toggleReview(): void {
    this.showReview = !this.showReview;
  }

  getOptionClass(questionIndex: number, optionIndex: number): string {
    if (!this.test) return '';
    
    const question = this.test.questions[questionIndex];
    if (!question) return '';
    
    if (this.testCompleted) {
      if (optionIndex === question.correctAnswer) {
        return 'correct';
      } else if (this.answers[questionIndex] === optionIndex) {
        return 'incorrect';
      }
    }
    
    return '';
  }

  get currentQuestion(): Question | null {
    return this.test?.questions[this.currentQuestionIndex] || null;
  }

  getTotalPossibleScore(): number {
    if (!this.test) return 0;
    return this.test.questions.reduce((total, q) => total + (q.points || 1), 0);
  }
}