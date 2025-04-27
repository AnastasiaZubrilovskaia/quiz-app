import { Routes } from '@angular/router';
import { TestCreatorComponent } from './components/teacher/test-creator/test-creator.component';
import { ResultsViewerComponent } from './components/teacher/results-viewer/results-viewer.component';
import { TestTakerComponent } from './components/student/test-taker/test-taker.component';
import { AttemptHistoryComponent } from './components/student/attempt-history/attempt-history.component';

export const routes: Routes = [
  // Преподавательская часть
  { 
    path: 'teacher',
    children: [
      { path: 'create-test', component: TestCreatorComponent },
      { path: 'results/:id', component: ResultsViewerComponent },
      { path: '', redirectTo: 'create-test', pathMatch: 'full' }
    ]
  },
  
  // Студенческая часть
  {
    path: 'student',
    children: [
      { path: 'take-test/:id', component: TestTakerComponent },
      { path: 'history', component: AttemptHistoryComponent },
      { path: '', redirectTo: 'history', pathMatch: 'full' }
    ]
  },
  
  // Перенаправления по умолчанию
  { path: '', redirectTo: '/student/history', pathMatch: 'full' },
  { path: '**', redirectTo: '/student/history' }
];
