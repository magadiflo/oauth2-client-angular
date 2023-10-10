import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { MenuComponent } from './components/menu/menu.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('menu') menu!: MenuComponent;
  private _router = inject(Router);

  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd) // NavigationEnd, un evento que se desencadena cuando una navegación finaliza correctamente.
      )
      .subscribe(resp => {
        console.log('Filtró NavigationEnd', resp);
        this.menu!.getLogged();
      });
  }

}
