import {Component, EventEmitter, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import {UserService} from "../../services/user.service";
import {SharingDataService} from "../../services/sharing-data.service";
import {PaginatorComponent} from "../paginator/paginator.component";

@Component({
  selector: 'user',
  standalone: true,
  imports: [
    RouterModule, PaginatorComponent
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  title: string = 'Listado de Usuarios!';

  users: User[] = [];
  paginator: any = {};

  constructor(private router: Router, private service: UserService, private sharingDta: SharingDataService, private route: ActivatedRoute) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      const user = this.router.getCurrentNavigation()?.extras.state!['user'];
      const paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
      //this.users = [...this.users, user];
    }
  }

  ngOnInit(): void {
    if ( this.users == undefined || this.users.length === 0) {
      //this.service.findAll().subscribe(users => this.users = users);
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page')!) || 0;
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[];
          this.paginator = pageable;
          this.sharingDta.pageUsersEventEmitter.emit({users: this.users, paginator: this.paginator});
        });
      });
    }
  }

  onRemoveUser(id: number) {
    this.sharingDta.idUserEventEmitter.emit(id);
  }

  onSelectUser(user: User) {
    this.router.navigate(['/users/edit', user.id]);
  }
}
