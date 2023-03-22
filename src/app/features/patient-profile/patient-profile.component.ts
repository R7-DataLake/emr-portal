import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PatientService } from '../patient/services/patient.service';

import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  bpChartOptions: EChartsOption = {
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
        data: [110, 100, 120, 110, 98, 125, 100, 111, 97, 100],
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
        data: [80, 88, 90, 85, 68, 80, 87, 89, 86, 85],
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
  };

  pulseChartOptions: EChartsOption = {
    title: {
      text: 'อัตราการเต้นของหัวใจ',
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
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [89, 88, 80, 90, 100, 98, 87, 88, 78, 89],
        type: 'line',
        smooth: true,
        name: 'Heart Rate',
        markLine: {
          data: [{ name: 'ค่าปกติ', yAxis: 80 }],
          symbol: 'none'
        }
      },
    ],
  };

  dataOpd: any = [];

  html: any = `#นัด 1 Wk. + LAB,
ekg,CXR ก่อนพบแพทย์
`

  constructor (
    private router: Router,
    private message: NzMessageService,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void { }

  onBack(): void {
    this.router.navigate(['/dashboard'])
  }


}
