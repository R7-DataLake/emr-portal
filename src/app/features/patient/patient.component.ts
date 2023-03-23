import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PatientService } from '../../shared/services/patient.service';
import { ModalIpdVisitComponent } from './modals/modal-ipd-visit/modal-ipd-visit.component';
import { ModalPatientOpdVisitComponent } from './modals/modal-patient-opd-visit/modal-patient-opd-visit.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  @ViewChild(ModalPatientOpdVisitComponent) private mdlPatientOpdVisit!: ModalPatientOpdVisitComponent;
  @ViewChild(ModalIpdVisitComponent) private mdlPatientIpdVisit!: ModalIpdVisitComponent;

  datasets: any[] = []
  lastOpd: any[] = []
  lastIpd: any[] = []
  query: any = ''

  total = 0
  pageSize = 20
  pageIndex = 1
  offset = 0
  loading = true

  personQuery: any = null;

  visibleOpdVisit = false;
  visibleIpdVisit = false;

  constructor (
    private router: Router,
    private message: NzMessageService,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.getPatient();
  }

  onBack(): void {
    this.router.navigate(['/dashboard'])
  }

  onPageIndexChange(pageIndex: any) {

    this.offset = pageIndex === 1 ?
      0 : (pageIndex - 1) * this.pageSize;

    this.getPatient()
  }

  onPageSizeChange(pageSize: any) {
    this.pageSize = pageSize
    this.pageIndex = 1

    this.offset = 0

    this.getPatient()
  }

  onSearchSubmit(query: any) {
    if (query) {
      this.query = query
      this.getPatient()
    }
  }

  async getPatient() {
    this.loading = true
    try {
      const _limit = this.pageSize
      const _offset = this.offset

      const response = await this.patientService.getPatientList(this.query, _limit, _offset)

      this.loading = false
      const responseData: any = response.data
      this.total = responseData.total || 1
      this.datasets = responseData.results.map((v: any) => {
        v.age = DateTime.now().get('year') - DateTime.fromFormat(v.birth, 'yyyy-MM-dd').get('year')
        v.birth = DateTime.fromFormat(v.birth, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED)
        v.d_update = DateTime.fromISO(v.d_update, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATETIME_SHORT);
        v.sex = v.sex == '1' ? 'ชาย' : 'หญิง';
        return v
      })

    } catch (error: any) {
      this.loading = false
      this.message.error(`${error.code} - ${error.message}`)
    }
  }

  async getLastOpd(cid: any) {
    this.loading = true
    try {
      const response = await this.patientService.getLastOPD(cid)

      this.loading = false
      const responseData: any = response.data
      this.lastOpd = responseData.map((v: any) => {
        v.date_serv = DateTime.fromFormat(v.date_serv, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED)
        v.date_serv_th = `${v.date_serv} เวลา ${v.time_serv}`;
        return v
      })

    } catch (error: any) {
      this.loading = false
      this.message.error(`${error.code} - ${error.message}`)
    }
  }

  async getLastIpd(cid: any) {
    this.loading = true
    try {
      const response = await this.patientService.getLastIPD(cid)

      this.loading = false
      const responseData: any = response.data
      this.lastIpd = responseData.map((v: any) => {
        v.datedsc = DateTime.fromFormat(v.datedsc, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED)
        v.datedsc_th = `${v.datedsc} เวลา ${DateTime.fromFormat(v.timedsc, 'HHmm').toFormat('HH:mm')}`;
        v.dateadm = DateTime.fromFormat(v.dateadm, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED)
        v.dateadm_th = `${v.dateadm} เวลา ${DateTime.fromFormat(v.timeadm, 'HHmm').toFormat('HH:mm')}`;
        return v;
      })

    } catch (error: any) {
      this.loading = false
      this.message.error(`${error.code} - ${error.message}`)
    }
  }

  refresh() { }

  search() { }

  closeOpdVisit() {
    this.visibleOpdVisit = false;
  }

  openOpdVisit(data: any) {
    this.getLastOpd(data.cid);
    this.visibleOpdVisit = true;
  }

  closeIpdVisit() {
    this.visibleIpdVisit = false;
  }

  openIpdVisit(data: any) {
    this.getLastIpd(data.cid);
    this.visibleIpdVisit = true;
  }

  async searchPerson() {
    if (this.personQuery) {
      this.loading = true
      try {
        const response = await this.patientService.search(this.personQuery)

        this.loading = false
        const responseData: any = response.data
        this.datasets = [];
        this.total = 0;
        this.datasets = responseData.map((v: any) => {
          v.age = DateTime.now().get('year') - DateTime.fromFormat(v.birth, 'yyyy-MM-dd').get('year')
          v.birth = DateTime.fromFormat(v.birth, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED)
          v.d_update = DateTime.fromISO(v.d_update, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATETIME_SHORT);
          v.sex = v.sex == '1' ? 'ชาย' : 'หญิง';
          return v
        });

      } catch (error: any) {
        this.loading = false
        this.message.error(`${error.code} - ${error.message}`)
      }
    }
  }

  refreshPerson() {
    this.personQuery = null;
    this.pageIndex = 1;
    this.offset = 0;
    this.total = 0;

    this.getPatient();
  }

  openOpdDetail(data: any) {
    this.mdlPatientOpdVisit.showModal(data.hospcode, data.seq, data.hn, data.zone_key);
  }

  openIpdDetail(data: any) {
    console.log(data);
    this.mdlPatientIpdVisit.showModal(data.hospcode, data.an, data.hn, data.zone_key);
  }

  openPatientProfile(data: any) {
    const obj: any = {
      cid: data.cid,
      hn: data.hn,
      hospcode: data.hospcode,
      zoneKey: data.zone_key
    };
    var encodedHash = btoa(JSON.stringify(obj));
    this.router.navigate(['/patient-profile'], {
      queryParams: {
        hashKey: encodedHash
      }
    })
  }
}
