import { Component, ElementRef, ViewChild, AfterViewChecked  } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { Question } from '../../../models/question.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-creator',
  templateUrl: './test-creator.component.html',
  styleUrls: ['./test-creator.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class TestCreatorComponent {
  testTitle = '';
  testDescription = '';
  currentTestId: string | null = null;
  
  newQuestion: Omit<Question, 'id'> = {
    text: '',
    options: ['', ''],
    correctAnswer: 0,
    points: 1
  };

  constructor(
    private testService: TestService,
    private snackBar: MatSnackBar
  ) {}

  createTest(): void {
    if (!this.testTitle) {
      this.showError('Please enter test title');
      return;
    }
    
    const test = this.testService.createTest(this.testTitle, this.testDescription);
    this.currentTestId = test.id;
    this.showSuccess('Test created successfully!');
    this.saveTest(); // Автосохранение при создании
  }
  trackByOption(index: number): number {
    return index;
  }

  addQuestion(): void {
    if (!this.currentTestId) {
      this.showError('Please create a test first');
      return;
    }
    
    if (!this.validateQuestion()) return;
    
    this.saveTest(); // Автосохранение после добавления вопроса
    
    this.resetQuestionForm();
    this.showSuccess('Question added successfully!');
  }

  saveTest(): void {
    if (!this.currentTestId) return;
    
    // Используем новый метод сохранения
      this.testService.saveTestWithCurrentQuestion(
        this.currentTestId, 
        this.newQuestion
      );

      this.showSuccess('Test saved successfully!');
  
  // Для отладки - проверим что сохранилось
      console.log(
        'Saved test:', 
        this.testService.getTestById(this.currentTestId)
    );
  }

  private validateQuestion(): boolean {
    if (!this.newQuestion.text || this.newQuestion.options.some(opt => !opt)) {
      this.showError('Please fill all question fields');
      return false;
    }
    return true;
  }

  public hasUnsavedQuestion(): boolean {
    return !!this.newQuestion.text || 
           this.newQuestion.options.some(opt => !!opt);
  }

  private resetQuestionForm(): void {
    this.newQuestion = {
      text: '',
      options: ['', ''],
      correctAnswer: 0,
      points: 1
    };
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  removeOption(index: number): void {
    if (this.newQuestion.options.length > 2) {
      this.newQuestion.options.splice(index, 1);
      
      if (this.newQuestion.correctAnswer >= index) {
        this.newQuestion.correctAnswer = Math.max(0, this.newQuestion.correctAnswer - 1);
      }
    }
  }

  addOption(): void {
    this.newQuestion.options.push('');
  }

  downloadTestJson(): void {
    if (!this.currentTestId) return;
    
    const test = this.testService.getTestById(this.currentTestId);
    if (!test) return;
    
    const dataStr = JSON.stringify(test, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `test-${test.title}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}