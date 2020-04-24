import { Component, OnInit } from '@angular/core';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.atom.html',
  styleUrls: ['./<%= dasherize(name) %>.atom.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
