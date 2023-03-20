import { Component } from '@angular/core';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmrService } from '../../services/emr.service';

@Component({
  selector: 'app-modal-ipd-visit',
  templateUrl: './modal-ipd-visit.component.html',
  styleUrls: ['./modal-ipd-visit.component.css']
})
export class ModalIpdVisitComponent {


  isVisible = false;
  loading = false;

  diagData: any = [];
  drugData: any = [];
  labData: any = [];
  ipdInfo: any = {};
  personInfo: any = {};

  hospcode: any;
  an: any;
  hn: any;
  zoneKey: any;

  constructor (
    private emrService: EmrService,
    private message: NzMessageService,
  ) { }

  /**
   * 
   * @param hospcode รหัสหน่วยบริการ
   * @param an ลำดับที่ Admin
   * @param hn เลขประจำตัวผู้ป่วย
   * @param zoneKey รหัส Zone
   */
  showModal(hospcode: any, an: any, hn: any, zoneKey: any) {
    this.hospcode = hospcode;
    this.an = an;
    this.hn = hn;
    this.zoneKey = zoneKey;

    this.diagData = [];
    this.drugData = [];
    this.labData = [];
    this.ipdInfo = {};
    this.personInfo = {};

    this.isVisible = true;

    this.getPersonInfo();
    this.getIpdInfo();
  }

  handleOk() {
    this.isVisible = false;
  }

  async getDiag() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getIpdDiag(this.hospcode, this.hn, this.an, this.zoneKey);
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
      const response: any = await this.emrService.getIpdDrug(this.hospcode, this.hn, this.an, this.zoneKey);
      this.loading = false;
      this.drugData = response.data.results;
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

  async getIpdInfo() {
    this.loading = true;
    try {
      const response: any = await this.emrService.getIpdInfo(this.hospcode, this.hn, this.an, this.zoneKey);
      this.loading = false;
      this.ipdInfo = response.data;
      this.ipdInfo.dateadm = DateTime.fromFormat(response.data.dateadm, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);
      this.ipdInfo.datedsc = DateTime.fromFormat(response.data.datedsc, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);
      this.ipdInfo.timedsc = DateTime.fromFormat(this.ipdInfo.timedsc, 'HHmm').toFormat('HH:mm');
      this.ipdInfo.timeadm = DateTime.fromFormat(this.ipdInfo.timeadm, 'HHmm').toFormat('HH:mm');
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
    }

  }

}
