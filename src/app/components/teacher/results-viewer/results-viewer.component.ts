import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { TestService } from '../../../services/test.service';
import { Attempt } from '../../../models/attempt.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results-viewer',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIconModule],
  templateUrl: './results-viewer.component.html',
  styleUrls: ['./results-viewer.component.scss']
})
export class ResultsViewerComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'score', 'date'];
  attempts: Attempt[] = [];
  testTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    const testId = this.route.snapshot.paramMap.get('id');
    if (testId) {
      // Получаем попытки из сервиса
      this.attempts = this.testService.getAttemptsByTestId(testId);
      
      // Получаем название теста
      const test = this.testService.getTestById(testId);
      this.testTitle = test?.title || 'Unknown Test';
      
      console.log('Loaded attempts:', this.attempts); // Для отладки
    }
  }
}