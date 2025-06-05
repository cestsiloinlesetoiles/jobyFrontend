import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  userName = '';
  showProfileMenu = false;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.userName = user.firstName && user.lastName ?
          `${user.firstName} ${user.lastName}` : user.email || 'User';
      } else {
        this.userName = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  updateUserInfo() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.firstName && user.lastName ?
        `${user.firstName} ${user.lastName}` : user.email || 'User';
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isRecruiter(): boolean {
    const userRole = this.authService.getCurrentUserRole();
    return userRole === UserRole.RECRUITER;
  }

  toggleProfileMenu() {
    this.updateUserInfo();
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');

    if (!dropdown) {
      this.showProfileMenu = false;
    }
  }
}
