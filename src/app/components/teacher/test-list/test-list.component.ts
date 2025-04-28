import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Test } from '../../../models/test.model';
import { TestService } from '../../../services/test.service';
import { BehaviorSubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss'
})
export class TestListComponent implements OnInit {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  tests: Test[] = [];

  constructor(
    private testService: TestService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$.next(this.authService.isAuthenticated());
  }

  ngOnInit(): void {
    this.tests = this.testService.getTests();
  }

  deleteTest(id: string): void {
    if (confirm('Вы уверены, что хотите удалить этот тест? Все результаты будут потеряны.')) {
        this.testService.deleteTest(id);
        this.tests = this.tests.filter(test => test.id !== id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
  onTestClick(test: Test): void {
    if (this.isAuthenticated$.value) {
      // Для авторизованных (учителей)
      this.router.navigate(['/tests', test.id, 'results']);
    } else {
      // Для неавторизованных (студентов)
      this.router.navigate(['/test', test.id]);
    }
  }
}
