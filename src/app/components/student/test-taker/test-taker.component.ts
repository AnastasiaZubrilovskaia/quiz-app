import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { Test} from '../../../models/test.model';
import { Question } from '../../../models/question.model';
import { Attempt } from '../../../models/attempt.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-taker',
  templateUrl: './test-taker.component.html',
  styleUrls: ['./test-taker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    RouterLink
  ]
})
export class TestTakerComponent implements OnInit {
  testId: string = '';
  studentName: string = '';
  test: Test | null = null;
  currentQuestionIndex: number = 0;
  answers: number[] = [];
  testCompleted: boolean = false;
  result: Attempt | null = null;

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private snackBar: MatSnackBar
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
    if (!this.studentName) {
      this.snackBar.open('Please enter your name', 'Close', { duration: 3000 });
      return;
    }
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
      this.snackBar.open('Please answer all questions', 'Close', { duration: 3000 });
      return;
    }
    
    if (this.test && this.studentName) {
      this.result = this.testService.evaluateTest(this.test.id, this.studentName, this.answers);
      this.testCompleted = true;
    }
  }

  get currentQuestion(): Question | null {
    return this.test?.questions[this.currentQuestionIndex] || null;
  }
}