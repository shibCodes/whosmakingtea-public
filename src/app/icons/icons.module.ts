import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { PlusCircle, XCircle, CheckCircle, Save, Circle, RefreshCw, AlertCircle, MoreHorizontal, Trash2, LogOut, Check, Menu, X, Edit3 } from 'angular-feather/icons';

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
  Menu,
  X,
  Edit3
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
