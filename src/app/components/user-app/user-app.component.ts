import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2'
import { Router, RouterOutlet} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";
import {SharingDataService} from "../../services/sharing-data.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  constructor(
    private sharingData: SharingDataService,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.handlerLogin();
  }

  handlerLogin() {
    this.sharingData.handleLoginEventEmitter.subscribe(({username, password}) => {
      this.authService.loginUser({username, password}).subscribe({
        next: response => {
          const token = response.token;
          const payload = this.authService.getPayload(token);

          const user = {username: payload.sub};
          const loginData ={
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          }

          this.authService.token = token;
          this.authService.user = loginData;
          this.router.navigate(['/users']);
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

}
