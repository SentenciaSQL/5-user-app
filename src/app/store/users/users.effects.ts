import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {UserService} from "../../services/user.service";
import {
    add,
    addSuccess,
    findAll,
    findAllPageable,
    load, remove, removeSuccess,
    setErrors,
    setPaginator,
    update,
    updateSuccess
} from "./users.actions";
import {catchError, EMPTY, exhaustMap, map, of, tap} from "rxjs";
import {User} from "../../models/user";
import {error} from "@angular/compiler-cli/src/transformers/util";
import Swal from "sweetalert2";
import {Router} from "@angular/router";


@Injectable()
export class UsersEffects{

  loadUsers$ =  createEffect(() => this.actions$.pipe(
    ofType(load),
    exhaustMap(action => this.service.findAllPageable(action.page)
      .pipe(
        map(pageable => {
          const users = pageable.content as User[];
          const paginator = pageable;

          return findAllPageable({users, paginator});
        }),
        catchError((error) => of(error))
      ))
  ));

  addUser$ = createEffect(() => this.actions$.pipe(
      ofType(add),
      exhaustMap(action => this.service.create(action.userNew)
          .pipe(
              map(userNew => addSuccess({userNew})),
              catchError(error => (error.status == 400) ? of(setErrors({userForm: action.userNew, errors: error.error})) : of(error))
          ))
  ));

  addSuccessUser$ = createEffect(() => this.actions$.pipe(
      ofType(addSuccess),
      tap(() => {
          this.router.navigate(['/users']);
          Swal.fire({
              title: "Good job user created!",
              text: "You clicked the button!",
              icon: "success"
          });
      })
  ), {dispatch: false});

updateUser$ = createEffect(() => this.actions$.pipe(
    ofType(update),
    exhaustMap(action => this.service.update(action.userUpdated)
        .pipe(
            map(userUpdated => updateSuccess({userUpdated})),
            catchError(error => (error.status == 400) ? of(setErrors({userForm: action.userUpdated, errors: error.error})) : of(error))
        ))
));

updateSuccessUser$ = createEffect(() => this.actions$.pipe(
    ofType(updateSuccess),
    tap(() => {
        this.router.navigate(['/users']);
        Swal.fire({
            title: "Good job user updated!",
            text: "You clicked the button!",
            icon: "success"
        });
    })
), {dispatch: false});

removeUser$ = createEffect(() => this.actions$.pipe(
    ofType(remove),
    exhaustMap(action => this.service.remove(action.id)
        .pipe(
            map(() => removeSuccess({id: action.id}))
        ))
));

removeSuccessUser$ = createEffect(() => this.actions$.pipe(
    ofType(removeSuccess),
    tap(() => {
        this.router.navigate(['/users']);
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
        });
    })
), {dispatch: false});

  constructor(
      private router: Router,
      private actions$: Actions,
      private service: UserService
  ) {}
}
