import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { NgZorroModule } from '../../ng-zorro.module';
import { FormsModule } from '@angular/forms';
import { ModalPatientOpdVisitComponent } from './modals/modal-patient-opd-visit/modal-patient-opd-visit.component';
import { ModalIpdVisitComponent } from './modals/modal-ipd-visit/modal-ipd-visit.component';


@NgModule({
  declarations: [
    PatientComponent,
    ModalPatientOpdVisitComponent,
    ModalIpdVisitComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroModule,
    PatientRoutingModule
  ]
})
export class PatientModule { }
