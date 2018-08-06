import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public selectedBoat: string;
  private boats: any;

  searchBoat = (searchedTerm: Observable<string>) => {
    return searchedTerm.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.boats.filter(boat => boat
          .toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10))
    );
  }

  isLoginButtonDisabled = () => {
    return !this.boats.includes(this.selectedBoat);
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('localhost:8080/boats')
    .subscribe((response) => {
      this.boats = response;
    }) ;
  }
}
