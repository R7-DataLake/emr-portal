import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalPatientOpdVisitComponent } from './modals/modal-patient-opd-visit/modal-patient-opd-visit.component';
import { PatientService } from './services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  @ViewChild(ModalPatientOpdVisitComponent) private mdlPatientOpdVisit!: ModalPatientOpdVisitComponent;

  datasets: any[] = []
  lastOpd: any[] = []
  query: any = ''

  total = 0
  pageSize = 20
  pageIndex = 1
  offset = 0
  loading = true

  personQuery: any = null;

  visibleOpdVisit = false;

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

  refresh() { }

  search() { }

  closeOpdVisit() {
    this.visibleOpdVisit = false;
  }

  openOpdVisit(data: any) {
    this.getLastOpd('5401400030088');
    this.visibleOpdVisit = true;
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

  refreshPerson() { }

  openOpdDetail(data: any) {
    this.mdlPatientOpdVisit.showModal(data.hospcode, data.seq, data.hn, data.zone_key);
  }
}
