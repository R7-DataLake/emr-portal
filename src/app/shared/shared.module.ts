import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchComponent } from './modals/modal-search/modal-search.component';
import { NgZorroModule } from '../ng-zorro.module';
import { FormsModule } from '@angular/forms';
import { Nl2brPipe } from './pipes/nl2br.pipe';


@NgModule({
  declarations: [
    ModalSearchComponent,
    Nl2brPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroModule
  ],
  exports: [
    ModalSearchComponent,
    Nl2brPipe,
  ]
})
export class SharedModule { }
