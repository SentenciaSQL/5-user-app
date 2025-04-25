import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import Swal from 'sweetalert2'
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";
import {SharingDataService} from "../../services/sharing-data.service";

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  users: User[] = [];
  paginator: any = {};

  constructor(private service: UserService, private sharingData: SharingDataService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    //this.service.findAll().subscribe(users => this.users = users);
    // this.route.paramMap.subscribe(params => {
    //   const page = +(params.get('page')!) || 0;
    //   //this.service.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    // });
    this.addUser();
    this.removeUser();
    this.findUserById()
    this.pageUsersEvent();
  }

  pageUsersEvent() {
    this.sharingData.pageUsersEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {
      const user = this.users.find(user => user.id == id);

      this.sharingData.selectedUserEventEmitter.emit(user);
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.service.update(user).subscribe({next: (userUpdated) => {
          this.users = this.users.map(userItem => (userItem.id === userUpdated.id) ? {...userUpdated} : userItem);
          this.router.navigate(['/users'], {state: {users: this.users, paginator: this.paginator} });
            Swal.fire({
              title: "Good job user updated!",
              text: "You clicked the button!",
              icon: "success"
            });
        }, error: (err) => {
            if (err.status === 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }
        }})
      } else {
        this.service.create(user).subscribe({next: (userNew) => {
          this.users = [...this.users, {...userNew}];
          this.router.navigate(['/users'], {state: {users: this.users, paginator: this.paginator} });
          Swal.fire({
            title: "Good job user created!",
            text: "You clicked the button!",
            icon: "success"
          });
        }, error: (err) => {
            if (err.status === 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }
          }});
      }
    });
  }

  removeUser() {
    this.sharingData.idUserEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.remove(id).subscribe(() => {
            this.users = this.users.filter(user => user.id !== id);
            this.router.navigate(['/users/create'], {skipLocationChange: true}).then(() => {
              this.router.navigate(['/users'], {state: {users: this.users} });
              //this.router.navigate(['/users']);
            });
          });
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
    });

  }

}
