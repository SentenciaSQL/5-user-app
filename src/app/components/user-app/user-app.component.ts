import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import Swal from 'sweetalert2'
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";
import {SharingDataService} from "../../services/sharing-data.service";
import {AuthService} from "../../services/auth.service";
import {Store} from "@ngrx/store";
import {add, find, findAll, remove, setPaginator, update} from "../../store/users.actions";

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
  user!: User;

  constructor(
    private store: Store<{users: any}>,
    private service: UserService,
    private sharingData: SharingDataService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {
    this.store.select('users').subscribe(state => {
      this.users = state.users;
      this.paginator = state.paginator;
      this.user = {...state.user};
    });
  }

  ngOnInit(): void {
    this.addUser();
    this.removeUser();
    this.findUserById()
    this.pageUsersEvent();
    this.handlerLogin();
  }

  handlerLogin() {
    this.sharingData.handleLoginEventEmitter.subscribe(({username, password}) => {
      console.log(username + ' ' + password);
      this.authService.loginUser({username, password}).subscribe({
        next: response => {
          const token = response.token;
          const payload = this.authService.getPayload(token);

          const user = {username: payload.sub};
          const login ={
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          }

          this.authService.token = token;
          this.authService.user = login;
          this.router.navigate(['/users/page/0']);
        },
        error: error => {
          if(error.status === 401) {
            console.log(error.error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
            })
          } else {
            throw error;
          }
        }
      });
    });
  }

  pageUsersEvent() {
    this.sharingData.pageUsersEventEmitter.subscribe(pageable => {
      // this.users = pageable.users;
      // this.paginator = pageable.paginator;
      this.store.dispatch(findAll({ users: pageable.users }));
      this.store.dispatch(setPaginator({paginator: pageable.paginator}));
    });
  }

  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {
      //const user = this.users.find(user => user.id == id);
      this.store.dispatch(find({id}));

      console.log(this.user);
      this.sharingData.selectedUserEventEmitter.emit(this.user);
    });
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {
      if (user.id > 0) {
        this.service.update(user).subscribe({next: (userUpdated) => {
          //this.users = this.users.map(userItem => (userItem.id === userUpdated.id) ? {...userUpdated} : userItem);
          this.store.dispatch(update({userUpdated}));

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
          //this.users = [...this.users, {...userNew}];
          this.store.dispatch(add({userNew}));
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
            //this.users = this.users.filter(user => user.id !== id);
            this.store.dispatch(remove({id}));
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
