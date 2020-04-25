import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ComponentsModule } from '../../nubs/components.module';

import { IconsModule } from '../../../icons/icons.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoginComponent
            }
        ]),
        ComponentsModule,
        IconsModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
