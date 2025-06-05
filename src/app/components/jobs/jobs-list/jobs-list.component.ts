import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../model/job.model';
import { JobCardComponent } from '../job-card/job-card.component';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, JobCardComponent],
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent {
  @Input() jobs: Job[] = [];

  constructor() { }
}
