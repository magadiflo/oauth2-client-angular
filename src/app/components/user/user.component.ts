import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public message: string = '';
  private _resourceService = inject(ResourceService);

  ngOnInit(): void {
    this._resourceService.user()
      .subscribe({
        next: response => this.message = response.message,
        error: err => {
          this.message = `status[${err.status}], message: ${err.message}`;
          console.log(err);
        }
      });
  }

}
