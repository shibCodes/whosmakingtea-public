import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LostPasswordComponent } from './lostpassword.component';
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
                component: LostPasswordComponent
            }
        ]),
        ComponentsModule,
        IconsModule
    ],
    declarations: [LostPasswordComponent]
})
export class LostPasswordModule { }
