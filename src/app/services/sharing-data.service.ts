import {EventEmitter, Injectable} from '@angular/core';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter = new EventEmitter<User>();
  private _idUserEventEmitter = new EventEmitter();
  private _findUserByIdEventEmitter = new EventEmitter();
  private _selectedUserEventEmitter = new EventEmitter<User>();
  private _errorsUserFormEventEmitter = new EventEmitter();

  constructor() { }

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this._idUserEventEmitter;
  }

  get findUserByIdEventEmitter() {
    return this._findUserByIdEventEmitter;
  }

  get selectedUserEventEmitter() {
    return this._selectedUserEventEmitter;
  }

  get errorsUserFormEventEmitter() {
    return this._errorsUserFormEventEmitter;
  }

}
