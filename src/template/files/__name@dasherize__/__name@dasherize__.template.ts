import { Component, OnInit } from '@angular/core';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.template.html',
  styleUrls: ['./<%= dasherize(name) %>.template.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
