import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ECharts, EChartsOption } from 'echarts';
import { PatientService } from '../../shared/services/patient.service';
import { ProfileService } from '../../shared/services/profile.service';
import { EmrService } from '../../shared/services/emr.service';
import { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  bpChartInstance!: ECharts;
  pulseChartInstance!: ECharts;
  bpChartOptions: EChartsOption = {};
  pulseChartOptions: EChartsOption = {};

  dataOpd: any = [];
  dataIpd: any = [];
  dataBp: any = [];
  dataPulse: any = [];
  lastOpd: any = {};
  lastIpd: any = {};
  lastBp: any = '-';
  lastPulse: any = '-';
  lastBmi: any = { weight: 0, bmi: 0 };
  lastWeight: any = '-';

  html: any = `#นัด 1 Wk. + LAB,
ekg,CXR ก่อนพบแพทย์
`
  cid: any;
  hospcode: any;
  zoneKey: any;
  hn: any;
  personInfo: any = {};
  lastAppoint: any = {};

  placeHolderImage: any = './assets/images/placeholder_male.png';

  isLoadingPersonInfo = false;
  isLoadingPulse = false;
  isLoadingBp = false;
  isLoadingIpd = false;
  isLoadingOpd = false;
  isLoadingAppoint = false;

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private profileService: ProfileService,
    private patientService: PatientService,
    private emrService: EmrService,
  ) {
    const hashKey: any = this.route.snapshot.queryParamMap.get('hashKey');
    const decodedKey = atob(hashKey);
    const jsonData: any = JSON.parse(decodedKey);

    this.cid = jsonData.cid;
    this.hn = jsonData.hn;
    this.hospcode = jsonData.hospcode;
    this.zoneKey = jsonData.zoneKey;
  }

  ngOnInit() {
    this._getPatientInfo();
    this._getLastBmi();
    this._getLastIpd();
    this._getLastOpd();
    this._getLastAppoint();
  }

  onBack(): void {
    this.router.navigate(['/dashboard'])
  }

  onBpChartInit(echart: any) {
    this.bpChartInstance = echart;
    this.bpChartInstance.showLoading();
    this._getLastBp();
  }

  onPulseChartInit(echart: any) {
    this.pulseChartInstance = echart;
    this.pulseChartInstance.showLoading();
    this._getLastPulse();
  }

  async _getLastAppoint() {
    this.isLoadingAppoint = true;
    try {
      const response: AxiosResponse = await this.profileService.getLastAppoint(this.cid);

      const data: any = response.data;

      if (!_.isEmpty(data)) {
        this.lastAppoint = { ...data };

        this.lastAppoint.appoint_date = data.appoint_date ? DateTime.fromISO(data.appoint_date, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED) : '-';
        this.lastAppoint.appoint_time = DateTime.fromFormat(data.appoint_time, 'HH:mm:ss').toFormat('HH:mm');
      }
      this.isLoadingAppoint = false;

    } catch (error) {
      this.isLoadingAppoint = false;
      console.log(error);
    }
  }

  async _getLastIpd() {
    this.isLoadingIpd = true;
    try {
      const response: AxiosResponse = await this.patientService.getLastIPD(this.cid);

      const data: any = response.data;

      if (!_.isEmpty(data)) {
        const dataIpd: any = data.map((v: any) => {
          v.dateadm = DateTime.fromFormat(v.dateadm, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);
          v.datedsc = DateTime.fromFormat(v.datedsc, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);
          v.timedsc = DateTime.fromFormat(v.timedsc, 'HHmm').toFormat('HH:mm');
          v.timeadm = DateTime.fromFormat(v.timeadm, 'HHmm').toFormat('HH:mm');
          return v;
        });

        this.dataIpd = dataIpd;
      }
      this.isLoadingIpd = false;

    } catch (error) {
      this.isLoadingIpd = false;
      console.log(error);
    }
  }

  async _getLastOpd() {
    this.isLoadingOpd = true;
    try {
      const response: AxiosResponse = await this.patientService.getLastOPD(this.cid);

      const data: any = response.data;

      if (!_.isEmpty(data)) {
        const dataOpd: any = data.map((v: any) => {
          v.date_serv = DateTime.fromFormat(v.date_serv, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);
          v.time_serv = DateTime.fromFormat(v.time_serv, 'HH:mm:ss').toFormat('HH:mm');
          return v;
        });

        this.lastOpd = data[0];

        this.dataOpd = dataOpd;
      } else {
        this.notification.create(
          'error',
          'เกิดข้อผิดพลาด',
          'ไม่พบข้อมูลบริการ อาจทำให้การแสดงผลข้อมูลผิดพลาดได้ กรุณาตรวจสอบข้อมูลอีกครั้ง'
        );
      }
      this.isLoadingOpd = false;

    } catch (error) {
      this.isLoadingOpd = false;
      console.log(error);
    }
  }

  async _getPatientInfo() {
    this.isLoadingPersonInfo = true;
    try {
      const response: AxiosResponse = await this.emrService.getPersonInfo(this.hospcode, this.hn, this.zoneKey);

      const info: any = response.data;

      if (!_.isEmpty(info)) {
        info.fullname = `${info.fname} ${info.lname}`;

        const n = DateTime.now().get('year');
        const b = DateTime.fromFormat(info.birth, 'yyyy-MM-dd').get('year');

        const age = n - b;
        info.age = age;

        info.birth = DateTime.fromFormat(info.birth, 'yyyy-MM-dd', { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED);

        info.sex === 'ชาย' ? this.placeHolderImage = './assets/images/placeholder_male.png' : this.placeHolderImage = './assets/images/placeholder_female.png';

        this.personInfo = info;
      }
      this.isLoadingPersonInfo = false;

    } catch (error) {
      this.isLoadingPersonInfo = false;
      console.log(error);
    }
  }

  async _getLastBp() {
    try {
      const response: AxiosResponse = await this.profileService.getBp(this.cid);

      const data: any = response.data;
      if (!_.isEmpty(data)) {
        this.lastBp = `${data[0].sbp}/${data[0].dbp}`;
        const bpData: any = _.orderBy(data, 'date_serv', 'asc');
        this._setBpChart(bpData);
      }
      this.bpChartInstance.hideLoading();

    } catch (error) {
      this.bpChartInstance.hideLoading();
      console.log(error);
    }
  }

  async _getLastBmi() {
    try {
      const response: AxiosResponse = await this.profileService.getBmi(this.cid);

      const data: any = response.data;
      if (!_.isEmpty(data)) {
        this.lastBmi = data[0];
        console.log(this.lastBmi);
      }

    } catch (error) {
      console.log(error);
    }
  }

  async _getLastPulse() {
    try {
      const response: AxiosResponse = await this.profileService.getPulse(this.cid);

      const data: any = response.data;

      if (!_.isEmpty(data)) {
        this.lastPulse = data[0].pr || '0';
        const pulseData: any = _.orderBy(data, 'date_serv', 'asc');
        this._setPulseChart(pulseData);
      }
      this.pulseChartInstance.hideLoading();

    } catch (error) {
      this.pulseChartInstance.hideLoading();
      console.log(error);
    }
  }

  private async _setBpChart(data: any[]) {
    let sbp: number[] = [];
    let dbp: number[] = [];
    let labels: any = [];

    for (const d of data) {
      sbp.push(Number(d.sbp));
      dbp.push(Number(d.dbp));
      labels.push(DateTime.fromISO(d.date_serv, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED));
    }

    this.bpChartInstance.setOption({
      title: {
        text: 'ความดันโลหิต',
        left: 'left',
        textStyle: {
          fontFamily: "Kanit"
        },
        subtext: 'mg/dl',
        subtextStyle: {
          fontFamily: "Kanit"
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameTextStyle: {
          fontFamily: "Kanit"
        },
        data: labels
      },
      yAxis: {
        type: 'value',
      },
      legend: {
        data: ['Systolic', 'Diastolic'],
        bottom: 'bottom'
      },
      series: [
        {
          data: sbp,
          type: 'line',
          smooth: true,
          name: 'Systolic',
          markLine: {
            data: [
              { name: 'ค่าปกติ', yAxis: 110 },
              {
                name: 'ไม่ควรเกิน', yAxis: 140, lineStyle: {
                  color: '#DF2E38'
                }
              }
            ],
            symbol: 'none'
          }
        },
        {
          data: dbp,
          type: 'line',
          smooth: true,
          name: 'Diastolic',
          markLine: {
            data: [
              { name: 'ค่าปกติ', yAxis: 80 }
            ],
            symbol: 'none'
          }
        },
      ],
    });
  }

  private async _setPulseChart(data: any[]) {
    let pulse: number[] = [];
    let labels: any = [];

    for (const d of data) {
      pulse.push(Number(d.pr));
      labels.push(DateTime.fromISO(d.date_serv, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_MED));
    }

    this.pulseChartInstance.setOption({
      title: {
        text: 'อัตราเต้นของหัวใจ',
        left: 'left',
        textStyle: {
          fontFamily: "Kanit"
        },
        subtext: 'ครั้ง/นาที',
        subtextStyle: {
          fontFamily: "Kanit"
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Heart Rate'],
        bottom: 'bottom'
      },
      xAxis: {
        type: 'category',
        nameTextStyle: {
          fontFamily: "Kanit"
        },
        data: labels
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: pulse,
          type: 'line',
          smooth: true,
          name: 'Heart Rate',
          markLine: {
            data: [{ name: 'ค่าปกติ', yAxis: 80 }],
            symbol: 'none'
          }
        },
      ],
    });
  }

}
