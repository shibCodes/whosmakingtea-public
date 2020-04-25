import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ComponentsModule } from '../../nubs/components.module';

import { IconsModule } from '../../../icons/icons.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
