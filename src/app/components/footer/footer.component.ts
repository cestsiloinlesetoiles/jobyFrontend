import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  
  socialLinks = [
    { name: 'Facebook', url: '#', icon: 'fab fa-facebook-f' },
    { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
    { name: 'LinkedIn', url: '#', icon: 'fab fa-linkedin-in' },
    { name: 'Instagram', url: '#', icon: 'fab fa-instagram' }
  ];
  
  quickLinks = [
    { name: 'About', url: '/about' },
    { name: 'Jobs', url: '/jobs' },
    { name: 'Companies', url: '/companies' },
    { name: 'Contact', url: '/contact' }
  ];
  
  legalLinks = [
    { name: 'Terms of Service', url: '/terms' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Cookies', url: '/cookies' }
  ];
} 