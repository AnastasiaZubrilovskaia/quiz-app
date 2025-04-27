import { Component, Input } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { Attempt } from '../../../models/attempt.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-viewer',
  templateUrl: './results-viewer.component.html',
  styleUrls: ['./results-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ]
})
export class ResultsViewerComponent {
  @Input() testId: string = '';
  attempts: Attempt[] = [];

  constructor(private testService: TestService) {}

  ngOnChanges(): void {
    if (this.testId) {
      this.loadAttempts();
    }
  }

  loadAttempts(): void {
    this.attempts = this.testService.getAttemptsByTestId(this.testId);
  }
}