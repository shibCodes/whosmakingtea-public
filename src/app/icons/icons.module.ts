import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { PlusCircle, XCircle, CheckCircle, Save, Circle, RefreshCw, AlertCircle, MoreHorizontal, Trash2, LogOut, Check, Menu } from 'angular-feather/icons';

const icons = {
  PlusCircle, 
  XCircle, 
  CheckCircle, 
  Save, 
  Circle, 
  RefreshCw, 
  AlertCircle, 
  MoreHorizontal, 
  Trash2, 
  LogOut, 
  Check, 
  Menu
};


@NgModule({
  imports: [
    CommonModule,
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
