import { Component } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { Attempt } from '../../../models/attempt.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attempt-history',
  templateUrl: './attempt-history.component.html',
  styleUrls: ['./attempt-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RouterLink
  ]
})
export class AttemptHistoryComponent {
  attempts: Attempt[] = [];

  constructor(private testService: TestService) {
    this.loadAttempts();
  }

  loadAttempts(): void {
    this.attempts = this.testService.getAttempts();
  }

  getAttemptsByTest(testId: string): Attempt[] {
    return this.attempts.filter(a => a.testId === testId);
  }
}