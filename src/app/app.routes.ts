import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { TestCreatorComponent } from './components/teacher/test-creator/test-creator.component';
import { ResultsViewerComponent } from './components/teacher/results-viewer/results-viewer.component';
import { TestTakerComponent } from './components/student/test-taker/test-taker.component';
import { AttemptHistoryComponent } from './components/student/attempt-history/attempt-history.component';
import { LoginComponent } from './components/teacher/login/login.component';
import { TestListComponent } from './components/teacher/test-list/test-list.component';

// export const routes: Routes = [
//   { path: '', component: TestListComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'test/:id', component: TestTakerComponent },
//   // Маршруты для учителей
//   { 
//     path: 'tests',
//     children: [
//       { path: '', component: TestListComponent, canActivate: [authGuard] },
//       { path: 'new', component: TestCreatorComponent, canActivate: [authGuard] },
//       {path: 'tests/new', component: TestCreatorComponent, canActivate: [authGuard] },
//       { path: ':id/results', component: ResultsViewerComponent, canActivate: [authGuard] }
//     ]
//   },
  
  


export const routes: Routes = [
  { path: '', redirectTo: '/tests', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tests', component: TestListComponent },
  {path: 'tests/new', component: TestCreatorComponent, canActivate: [authGuard] },
  { path: 'test/:id', component: TestTakerComponent },
  { path: 'tests/:id/results', component: ResultsViewerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/tests' }
];