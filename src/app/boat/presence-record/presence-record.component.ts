import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-presence-record',
  templateUrl: './presence-record.component.html',
  styleUrls: ['./presence-record.component.css']
})
export class PresenceRecordComponent implements OnInit {

  selectedBoat: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.selectedBoat = this.route.snapshot.paramMap.get('boat');
  }

}
