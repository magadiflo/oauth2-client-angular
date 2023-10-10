import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  public message: string = '';
  private _resourceService = inject(ResourceService);

  ngOnInit(): void {
    this._resourceService.admin()
      .subscribe({
        next: response => this.message = response.message,
        error: err => {
          this.message = `status[${err.status}], message: ${err.message}`;
          console.log(err);
        }
      });
  }

}
