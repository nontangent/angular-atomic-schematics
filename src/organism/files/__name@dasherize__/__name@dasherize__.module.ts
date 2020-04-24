import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.organism';

import {

} from '../../molecules';

@NgModule({
  declarations: [<%= classify(name) %>Component],
  imports: [
    CommonModule
  ],
  exports: [
    <%= classify(name) %>Component
  ]
})
export class <%= classify(name) %>Module { }
