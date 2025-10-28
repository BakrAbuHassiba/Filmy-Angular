import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css']
})
export class AboutUsComponent {
  teamMembers = [
    { name: 'Hossam', role: 'Front-end Developer'  },
    { name: 'Bakr', role: 'Fullstack-Developer', img: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Abdelrahman', role: 'Front-end Developer', img: 'https://i.pravatar.cc/150?img=7' }
  ];
}