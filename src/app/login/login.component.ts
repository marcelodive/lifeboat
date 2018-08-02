import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public selectedBoat: string;
  private boats: string[];

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

  constructor() { }

  ngOnInit() {
    this.boats = [
      'Pier 1 - Bote 01 | PHILIPPE REIS SILVA',
      'Pier 1 - Bote 02 | PIERRE PEREIRA RODRIGUES',
      'Pier 1 - Bote 03 | GUSTAVO VIEIRA GOMES',
      'Pier 2 - Bote 01 | BRUNO MENDONÇA',
      'Pier 2 - Bote 02 | JEFF JOSÉ RODRIGUES',
      'Pier 3 - Bote 01 | FILIPE TOMAZ FONTES FERREIRA',
      'Pier 3 - Bote 02 | MÁRCIA DE S. V. C. DE AMORIM',
      'Pier 3 - Bote 03 | CATIS MACEDO BEIRAL PASSOS',
      'Pier 4 - Bote 01 | SOFIA ALEXANDRA R. GUERRA CRUZ',
      'Pier 5 - Bote 01 | SINVAL JOSÉ DE SOUZA JÚNIOR',
      'Pier 6 - Bote 01 | ADRIANA MONTEIRO MARINHO',
      'Pier 7 - Bote 01 | REVELSON GOMES SANTOS',
      'Pier 8 - Bote 01 | FERNANDA BELLI CASTRO',
      'Pier 9 - Bote 01 | FLÁVIA DELGADO',
      'Pier 10 - Bote 01 | FERNANDO FRANCO DUARTE',
      'Pier 11 - Bote 01 | JOSÉ EUSTÁQUIO MESQUITA',
      'Pier 12 - Bote 01 | EDER COSTA REIS',
      'Pier 13 - Bote 01 | GUILHERME FERNANDES DE PAULA',
      'Pier 14 - Bote 01 | ERICO MARCEL GOMES CARVALHO',
      'Pier 15 - Bote 01 | ADRIANA MOTA CARDOSO',
      'Pier 16 - Bote 01 | JULIANA IUNES TRAD PASSOS',
      'Pier 18 - Bote 01 | KAIO RAMOS',
      'Pier 17 - Bote 01 | DANIEL CORREIA RAFAEL',
      'Pier 19 - Bote 01 | WALTER JUNIO DA S. CLEMENTINO',
      'Pier 20 - Bote 02 | Rodrigo Simões de Carvalho',
    ];
  }
}
