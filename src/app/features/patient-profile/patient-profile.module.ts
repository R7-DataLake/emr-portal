import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';

import { PatientProfileRoutingModule } from './patient-profile-routing.module';
import { PatientProfileComponent } from './patient-profile.component';
import { NgZorroModule } from '../../ng-zorro.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PatientProfileComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    SharedModule,
    PatientProfileRoutingModule
  ]
})
export class PatientProfileModule { }
