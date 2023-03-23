import { Component } from '@angular/core';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmrService } from '../../../../shared/services/emr.service';
import { PatientService } from '../../../../shared/services/patient.service';

@Component({
  selector: 'app-modal-patient-opd-visit',
  templateUrl: './modal-patient-opd-visit.component.html',
  styleUrls: ['./modal-patient-opd-visit.component.css']
})
export class ModalPatientOpdVisitComponent {

  isVisible = false;
  loading = false;

  diagData: any = [];
  drugData: any = [];
  labData: any = [];
  opdInfo: any = {};
  personInfo: any = {};

  hospcode: any;
  seq: any;
  hn: any;
  zoneKey: any;

  constructor (
    private patientService: PatientService,
    private emrService: EmrService,
    private message: NzMessageService,
  ) { }

  showModal(hospcode: any, seq: any, hn: any, zoneKey: any) {
    this.hospcode = hospcode;
    this.seq = seq;
    this.hn = hn;
    this.zoneKey = zoneKey;

    this.diagData = [];
    this.drugData = [];
    this.labData = [];
    this.opdInfo = {};
    this.personInfo = {};

    this.isVisible = true;

    this.getPersonInfo();
    this.getOpdInfo();
  }

  handleOk() {
    this.isVisible = false;
  }

  async getDiag() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getOpdDiag(this.hospcode, this.hn, this.seq, this.zoneKey);
      this.loading = false;
      this.diagData = response.data.results;
    } catch (error: any) {
      this.loading = false;
      // this.message.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  }

  async getDrug() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getOpdDrug(this.hospcode, this.hn, this.seq, this.zoneKey);
      this.loading = false;
      this.drugData = response.data.results;
    } catch (error: any) {
      this.loading = false;
      // this.message.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  }

  async getLab() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getOpdLab(this.hospcode, this.hn, this.seq, this.zoneKey);
      this.loading = false;
      this.labData = response.data.results;
    } catch (error: any) {
      this.loading = false;
      // this.message.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  }

  async getPersonInfo() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getPersonInfo(this.hospcode, this.hn, this.zoneKey);
      this.loading = false;
      this.personInfo = response.data;

      const n = DateTime.now().get('year');
      const b = DateTime.fromFormat(response.data.birth, 'yyyy-MM-dd').get('year');

      const age = n - b;
      this.personInfo.age = age;

      this.personInfo.birth = DateTime.fromFormat(response.data.birth, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);

      // console.log(this.personInfo);

    } catch (error: any) {
      this.loading = false;
      this.message.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  }

  async getOpdInfo() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getOpdInfo(this.hospcode, this.hn, this.seq, this.zoneKey);
      this.loading = false;
      this.opdInfo = response.data;
      this.opdInfo.date_serv = DateTime.fromFormat(response.data.date_serv, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);
    } catch (error: any) {
      this.loading = false;
      this.message.error('เกิดข้อผิดพลาด')
      console.log(error);
    }
  }

  onTabChange(event: any) {
    const tabIndex = event;
    if (tabIndex == 1) {
      if (_.isEmpty(this.diagData)) {
        this.getDiag();
      }
    } else if (tabIndex == 2) {
      if (_.isEmpty(this.drugData)) {
        this.getDrug();
      }
    } else if (tabIndex == 3) {
      if (_.isEmpty(this.labData)) {
        this.getLab();
      }
    }

  }

}
