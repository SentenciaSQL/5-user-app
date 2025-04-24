import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  url = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}users`);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}users/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}users`, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}users/${user.id}`, user);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}users/${id}`);
  }
}
