import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private teachers = [
    { login: 'teacher1', password: '12345' },
    { login: 'teacher2', password: '67890' }
  ];
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

  login(login: string, password: string): boolean {
    const teacher = this.teachers.find(t => 
      t.login === login && t.password === password);
    
    if (teacher) {
      localStorage.setItem('currentUser', JSON.stringify(teacher));
      this.isAuthenticated$.next(true);
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isAuthenticated$.next(false);
    this.router.navigate(['tests']); 
  }
}