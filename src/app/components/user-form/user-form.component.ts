import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {User} from "../../models/user";
import { SharingDataService } from '../../services/sharing-data.service';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  user: User;
  errors: any = {};

  constructor(private sharingDta: SharingDataService, private route: ActivatedRoute, private userService: UserService) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.sharingDta.errorsUserFormEventEmitter.subscribe(errors => this.errors = errors);
    this.sharingDta.selectedUserEventEmitter.subscribe(user => this.user = user);

    this.route.params.subscribe(params => {
      const id: number = params['id'] || 0;

      if (id > 0) {
        this.sharingDta.findUserByIdEventEmitter.emit(id);
        //this.userService.findById(id).subscribe(user => this.user = user);
      }
    });
  }

  onSubmit(userForm: NgForm) {
    //if (userForm.valid) {
      this.sharingDta.newUserEventEmitter.emit(this.user);
      console.log(this.user);
    //}

    // userForm.reset();
    // userForm.resetForm();
  }

  onClear(userForm: NgForm) {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

}
