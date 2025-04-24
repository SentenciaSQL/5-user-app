import {Component, EventEmitter, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {UserService} from "../../services/user.service";
import {SharingDataService} from "../../services/sharing-data.service";

@Component({
  selector: 'user',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  title: string = 'Listado Usuarios';

  users: User[] = [];

  constructor(private router: Router, private service: UserService, private sharingDta: SharingDataService) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      const user = this.router.getCurrentNavigation()?.extras.state!['user'];
      this.users = [...this.users, user];
    }
  }

  ngOnInit(): void {
    if ( this.users == undefined || this.users.length === 0) {
      console.log('consulta findAll');
      this.service.findAll().subscribe(users => this.users = users);
    }
  }

  onRemoveUser(id: number) {
    this.sharingDta.idUserEventEmitter.emit(id);
  }

  onSelectUser(user: User) {
    this.router.navigate(['/users/edit', user.id]);
  }
}
