import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: any = null;
  private teachers = [
    { login: 'teacher1', password: '12345' },
    { login: 'teacher2', password: '67890' }
  ];

  public login(login: string, password: string): boolean {
    const teacher = this.teachers.find(t => 
      t.login === login && t.password === password);
    
    if (teacher) {
      this.currentUser = teacher;
      localStorage.setItem('currentUser', JSON.stringify(teacher));
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}